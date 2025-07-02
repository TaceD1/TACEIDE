from rest_framework import serializers
from .models import Subject, Grade, Curriculum, Chapter, KnowledgePoint, LearningResource

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'

class LearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningResource
        fields = '__all__'

class KnowledgePointSerializer(serializers.ModelSerializer):
    resources = LearningResourceSerializer(many=True, read_only=True)
    
    class Meta:
        model = KnowledgePoint
        fields = '__all__'

class KnowledgePointSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgePoint
        fields = ['id', 'name', 'difficulty', 'order']

class ChapterSerializer(serializers.ModelSerializer):
    knowledge_points = KnowledgePointSimpleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Chapter
        fields = '__all__'

class ChapterSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'name', 'order']

class CurriculumSerializer(serializers.ModelSerializer):
    subject_name = serializers.ReadOnlyField(source='subject.name')
    grade_name = serializers.ReadOnlyField(source='grade.name')
    chapters = ChapterSimpleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Curriculum
        fields = '__all__'

class CurriculumDetailSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    grade = GradeSerializer(read_only=True)
    chapters = ChapterSerializer(many=True, read_only=True)
    
    class Meta:
        model = Curriculum
        fields = '__all__'