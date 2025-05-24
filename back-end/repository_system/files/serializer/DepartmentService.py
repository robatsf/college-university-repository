import uuid
from django.db import models
from django.utils.timezone import now
from ..models import DepartmentList
class DepartmentService:
    """
    Service class for updating DepartmentList instances.
    Pass a department id and a dictionary of values.
    If a field is numeric, the value will be added to the current value.
    Otherwise, the field will be overwritten.
    """

    @staticmethod
    def update_department(department_id, **updates):
        try:
            dept = DepartmentList.objects.get(id=department_id)
        except DepartmentList.DoesNotExist:
            raise ValueError("Department not found")
        
        for field, value in updates.items():
            if hasattr(dept, field):
                current_value = getattr(dept, field)
                if isinstance(current_value, (int, float)) and isinstance(value, (int, float)):
                    new_value = current_value + value
                else:
                    new_value = value
                setattr(dept, field, new_value)
        dept.save()
        return dept
