from rest_framework.response import Response
from rest_framework import status

class ResponseStructure:
    @staticmethod
    def success(data=None, message="Success", status_code=status.HTTP_200_OK):
        response = {
            "success": True,
            "data": data,
            "errors": [],
            "message": message
        }
        return Response(response, status=status_code)

    @staticmethod
    def error(message="Error", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        if not errors:
            errors = []
            
        response = {
            "success": False,
            "data": None,
            "errors": errors,
            "message": message
        }
        return Response(response, status=status_code)


