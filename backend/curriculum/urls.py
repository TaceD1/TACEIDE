from django.urls import path
from . import views

app_name = 'curriculum'

urlpatterns = [
    path('subjects/', views.SubjectListView.as_view(), name='subject-list'),
    path('grades/', views.GradeListView.as_view(), name='grade-list'),
    path('curriculums/', views.CurriculumListView.as_view(), name='curriculum-list'),
    path('curriculums/<int:pk>/', views.CurriculumDetailView.as_view(), name='curriculum-detail'),
    path('chapters/', views.ChapterListView.as_view(), name='chapter-list'),
    path('chapters/<int:pk>/', views.ChapterDetailView.as_view(), name='chapter-detail'),
    path('knowledge-points/', views.KnowledgePointListView.as_view(), name='knowledge-point-list'),
    path('knowledge-points/<int:pk>/', views.KnowledgePointDetailView.as_view(), name='knowledge-point-detail'),
    path('learning-resources/', views.LearningResourceListView.as_view(), name='learning-resource-list'),
    path('learning-resources/<int:pk>/', views.LearningResourceDetailView.as_view(), name='learning-resource-detail'),
    path('knowledge-points/by-curriculum/<int:curriculum_id>/', views.KnowledgePointByCurriculumView.as_view(), name='knowledge-points-by-curriculum'),
]