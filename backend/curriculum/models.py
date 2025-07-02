from django.db import models

class Subject(models.Model):
    """学科模型"""
    name = models.CharField(max_length=100, verbose_name='学科名称')
    code = models.CharField(max_length=50, unique=True, verbose_name='学科代码')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = '学科'
        verbose_name_plural = '学科'

class Grade(models.Model):
    """年级模型"""
    name = models.CharField(max_length=50, verbose_name='年级名称')  # 如：高一、高二
    code = models.CharField(max_length=20, unique=True, verbose_name='年级代码')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = '年级'
        verbose_name_plural = '年级'

class Curriculum(models.Model):
    """课程大纲模型"""
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, verbose_name='学科')
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, verbose_name='年级')
    name = models.CharField(max_length=200, verbose_name='大纲名称')
    description = models.TextField(blank=True, null=True, verbose_name='大纲描述')
    
    def __str__(self):
        return f"{self.grade.name}-{self.subject.name}-{self.name}"
    
    class Meta:
        verbose_name = '课程大纲'
        verbose_name_plural = '课程大纲'
        unique_together = ('subject', 'grade', 'name')

class Chapter(models.Model):
    """章节模型"""
    curriculum = models.ForeignKey(Curriculum, on_delete=models.CASCADE, related_name='chapters', verbose_name='所属大纲')
    name = models.CharField(max_length=200, verbose_name='章节名称')
    order = models.PositiveIntegerField(default=0, verbose_name='排序')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = '章节'
        verbose_name_plural = '章节'
        ordering = ['order']

class KnowledgePoint(models.Model):
    """知识点模型"""
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='knowledge_points', verbose_name='所属章节')
    name = models.CharField(max_length=255, verbose_name='知识点名称')
    description = models.TextField(blank=True, null=True, verbose_name='知识点描述')
    difficulty = models.PositiveSmallIntegerField(choices=[
        (1, '简单'),
        (2, '中等'),
        (3, '困难'),
        (4, '挑战'),
    ], default=2, verbose_name='难度级别')
    order = models.PositiveIntegerField(default=0, verbose_name='排序')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = '知识点'
        verbose_name_plural = '知识点'
        ordering = ['order']

class LearningResource(models.Model):
    """学习资源模型"""
    knowledge_point = models.ForeignKey(KnowledgePoint, on_delete=models.CASCADE, related_name='resources', verbose_name='关联知识点')
    title = models.CharField(max_length=255, verbose_name='资源标题')
    resource_type = models.CharField(max_length=50, choices=[
        ('video', '视频'),
        ('article', '文章'),
        ('exercise', '练习'),
        ('book', '书籍'),
    ], verbose_name='资源类型')
    url = models.URLField(verbose_name='资源链接')
    description = models.TextField(blank=True, null=True, verbose_name='资源描述')
    is_recommended = models.BooleanField(default=False, verbose_name='是否推荐')
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = '学习资源'
        verbose_name_plural = '学习资源'