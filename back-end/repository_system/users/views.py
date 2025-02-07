from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import GuestUserSerializer

class GuestRegistrationView(generics.CreateAPIView):
    queryset=CustomUser.objects.all()
    serializer_class=GuestUserSerializer

    def create(self,request,*args,**kwargs):
        serializer=self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"registered successfully"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
