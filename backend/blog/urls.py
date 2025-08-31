from django.urls import path
from .views import RegisterView, CurrentProfileDetail, ChangePassword, PostListCreateView, PostDetailView, CommentListCreateView, CommentDeleteView, UserPosts, MyPostsView, AllUsersView, SomeUserView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/profile/', CurrentProfileDetail.as_view()),
    path('user/change-password/', ChangePassword.as_view()),
    path('user/<int:pk>/posts/', UserPosts.as_view()),
    path('me/posts/', MyPostsView.as_view(), name='my-posts'),

    path('posts/', PostListCreateView.as_view()),
    path('posts/<int:pk>/', PostDetailView.as_view()),

    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='post-comments'),
    path('comments/<int:pk>/', CommentDeleteView.as_view(), name='comment-delete'),

    path('users/', AllUsersView.as_view()),
    path('user/<int:pk>/', SomeUserView.as_view()),

]
