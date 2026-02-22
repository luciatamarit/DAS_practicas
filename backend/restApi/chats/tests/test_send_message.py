from datetime import timedelta
from unittest.mock import patch

from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

from chats.models import Chat, ChatMessage
from users.models import Usage


User = get_user_model()


class SendMessageTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="u1",
            email="u1@test.com",
            password="Password123",
        )
        self.client.force_authenticate(user=self.user)
        self.chat = Chat.objects.create(user=self.user, title="t1")
        self.url = f"/api/chats/{self.chat.id}/messages/"

    @patch("chats.views.urllib.request.urlopen")
    def test_post_creates_two_messages_user_and_assistant(self, mock_urlopen):
        class FakeResp:
            def __enter__(self): return self
            def __exit__(self, exc_type, exc, tb): return False
            def read(self):
                return b'{"message":{"content":"hola"}}'

        mock_urlopen.return_value = FakeResp()

        res = self.client.post(self.url, {"content": "hi"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        self.assertEqual(ChatMessage.objects.filter(chat=self.chat).count(), 2)
        roles = list(ChatMessage.objects.filter(chat=self.chat).values_list("role", flat=True))
        self.assertIn("user", roles)
        self.assertIn("assistant", roles)

        self.assertIn("user", res.data)
        self.assertIn("assistant", res.data)

    @patch("chats.views.urllib.request.urlopen", side_effect=Exception("down"))
    def test_post_returns_503_and_does_not_create_assistant_on_llm_error(self, _mock):
        res = self.client.post(self.url, {"content": "hi"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)

        self.assertEqual(ChatMessage.objects.filter(chat=self.chat).count(), 1)
        msg = ChatMessage.objects.get(chat=self.chat)
        self.assertEqual(msg.role, "user")

    def test_post_returns_403_when_monthly_limit_exceeded(self):
        usage, _ = Usage.objects.get_or_create(user=self.user)
        usage.messages_limit = 0
        usage.messages_used = 0
        usage.reset_date = timezone.now() + timedelta(days=30)
        usage.save()

        res = self.client.post(self.url, {"content": "hi"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)