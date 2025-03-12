from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from ..models import FileSystem

@api_view(['POST'])
def approve_file(request, pk):
    try:
        file = FileSystem.objects.get(id=pk)
        statu = request.data.get('status')
        reason = request.data.get('reason')

        if  statu == 'approved':
            file.approved = 'approved'
            file.disapproval_reason = None
            file.availability = True
        else:
            if not reason:
                return Response(
                    {'error': 'Reason is required for disapproval'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            file.approved = "unapproved"
            file.disapproval_reason = reason

        file.save()

        return Response({
            'message': f'File {status} successfully',
            'approved_at': file.updated_time
        })

    except FileSystem.DoesNotExist:
        return Response(
            {'error': 'File not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_404_NOT_FOUND
        )