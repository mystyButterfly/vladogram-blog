from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.filters import SearchFilter
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.models import User 
from django.views import View

from .serializers import UserSerializer, PublicUserSerializer
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)  # Create the refresh token
            access = refresh.access_token  # Generate access token
            return Response({
                'status': 'success',
                'message': 'create new user',
                'data': {
                    'refresh': str(refresh),
                    'access': str(access),
                }
            }, 201)
        return Response({
            'status': 'fail',
            'message': 'fail to create new user',
            'data': serializer.errors
        }, 400)
    
class CurrentProfileDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user  # Get the current authenticated user
        serializer = UserSerializer(user)  # Serialize the user
        return Response({
            'status': 'success',
            'message': 'User profile details',
            'data': serializer.data
        }, 200)
    
    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'User profile updated successfully',
                'data': serializer.data
            }, 200)
        return Response({
            'status': 'fail',
            'message': 'Failed to update profile',
            'data': serializer.errors
        }, 400)
    
class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_new_password = request.data.get('confirm_new_password')

        # Check all fields are provided
        if not all([current_password, new_password, confirm_new_password]):
            return Response({
                'status': 'fail',
                'message': 'All password fields are required.'
            }, 400)
        
        # Check if new passwords match
        if new_password != confirm_new_password:
            return Response({
                'status': 'fail',
                'message': 'New password and confirmation do not match.'
            }, 400)

        # Check if current password is correct
        if not user.check_password(current_password):
            return Response({
                'status': 'fail',
                'message': 'Current password is incorrect.'
            }, 400)

        # Set the new password
        user.set_password(new_password)
        user.save()

        return Response({
            'status': 'success',
            'message': 'Password updated successfully.'
        }, 200)



class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    filter_backends = [SearchFilter]
    search_fields = ['title', 'content']
    # http://127.0.0.1:8000/api/posts/?search=something

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def put(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author != request.user:
            return Response({
                'status': 'fail',
                'message': 'You do not have permission to edit this post.',
            }, 403)
        
        return super().update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author != request.user:
            return Response({
                'status': 'fail',
                'message': 'You do not have permission to delete this post.',
            }, 403)
        
        return super().delete(request, *args, **kwargs)

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).order_by('created_at')

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(id=post_id)
        serializer.save(author=self.request.user, post=post)


class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.post.author != request.user:
            return Response({
                'status': 'fail',
                'message': 'Only the author of the post can delete this comment.'
            }, status=403)
        return super().delete(request, *args, **kwargs)

class UserPosts(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('pk')
        user = get_object_or_404(User, pk=user_id)
        posts = Post.objects.filter(author=user).order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response({
            'status': 'success',
            'message': f'Posts by user {user.username}',
            'data': serializer.data
        }, status=200)
    
class MyPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.filter(author=request.user).order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response({
            'status': 'success',
            'message': 'Posts by current user',
            'data': serializer.data
        }, status=200)

class AllUsersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all()
        serializer = PublicUserSerializer(users, many=True)
        return Response({
            'status': 'success',
            'message': 'List of all users',
            'data': serializer.data
        }, status=200)
    
class SomeUserView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('pk')
        user = get_object_or_404(User, pk=user_id)
        serializer = PublicUserSerializer(user)
        return Response({
            'status': 'success',
            'message': f'Detail for some user {user.username}',
            'data': serializer.data
        }, status=200)
    
class HomeView(View):
    def get(self, request):
        users = User.objects.values('username').order_by('id')
        context = {'users': users}
        return render(request, 'home.html', context=context)