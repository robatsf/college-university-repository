from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from ..models import History
from ..serializer.historySerializer import HistorySerializer

@api_view(['GET'])
def get_recent_activities(request):
    try:
        thirty_days_ago = timezone.now() - timedelta(days=30)
        activities = History.objects.filter(
            user_history_id=request.user.id,
            created_at__gte=thirty_days_ago
        ).order_by('-created_at')[:10]
        
        serializer = HistorySerializer(activities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': 'Failed to fetch recent activities', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def create_history(user_id, action):
    try:
        History.objects.create(
            user_history_id=user_id,
            action=action
        )
    except Exception as e:
        print(f"Failed to create history entry: {str(e)}")
