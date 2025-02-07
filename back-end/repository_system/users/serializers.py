from rest_framework import serializers
from django.contrib.auth  import get_user_model
from django.contrib.auth.hashers import make_password

User=get_user_model()

class GuestUserSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True,required=True)

    class Meta:
        model=User
        fields=['id','username','email','password','role']
        extra_kwargs={
            'password':{'read_only':True},
            'role':{'read_only':True},
            }
        
        def create(self,validated_data):
           validated_data['password']=make_password(validated_data['password'])
           validated_data['role']='guest'
           return super().create(validated_data)