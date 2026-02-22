

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Usage
from .serializers import UsageSerializer


class UsageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usage = Usage.objects.get(user=request.user)
        serializer = UsageSerializer(usage)
        return Response(serializer.data)