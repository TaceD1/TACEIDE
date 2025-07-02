from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Subject, Grade, Curriculum, Chapter, KnowledgePoint, LearningResource
from .serializers import (
    SubjectSerializer, GradeSerializer, CurriculumSerializer, CurriculumDetailSerializer,
    ChapterSerializer, KnowledgePointSerializer, LearningResourceSerializer, KnowledgePointSimpleSerializer
)

class SubjectListView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code']

class GradeListView(generics.ListCreateAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code']

class CurriculumListView(generics.ListCreateAPIView):
    queryset = Curriculum.objects.all()
    serializer_class = CurriculumSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subject', 'grade']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'subject__name', 'grade__name']

class CurriculumDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Curriculum.objects.all()
    serializer_class = CurriculumDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

class ChapterListView(generics.ListCreateAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['curriculum']
    search_fields = ['name']
    ordering_fields = ['order', 'name']

class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]

class KnowledgePointListView(generics.ListCreateAPIView):
    queryset = KnowledgePoint.objects.all()
    serializer_class = KnowledgePointSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['chapter', 'difficulty']
    search_fields = ['name', 'description']
    ordering_fields = ['order', 'name', 'difficulty']

class KnowledgePointDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = KnowledgePoint.objects.all()
    serializer_class = KnowledgePointSerializer
    permission_classes = [permissions.IsAuthenticated]

class LearningResourceListView(generics.ListCreateAPIView):
    queryset = LearningResource.objects.all()
    serializer_class = LearningResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['knowledge_point', 'resource_type', 'is_recommended']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'resource_type']

class LearningResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LearningResource.objects.all()
    serializer_class = LearningResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

class KnowledgePointByCurriculumView(generics.ListAPIView):
    serializer_class = KnowledgePointSimpleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        curriculum_id = self.kwargs.get('curriculum_id')
        return KnowledgePoint.objects.filter(
            chapter__curriculum_id=curriculum_id
        ).select_related('chapter').order_by('chapter__order', 'order')