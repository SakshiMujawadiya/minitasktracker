import axios, { AxiosError } from 'axios';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryParams,
  TaskStats,
  ApiResponse,
} from '../types/task';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string; success?: boolean }>;
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message;
    }
    if (axiosErr.message === 'Network Error') {
      return 'Unable to reach the TaskFlow backend server. Please verify the backend is running on port 5000.';
    }
    return axiosErr.message || 'An unexpected API error occurred.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
};

/**
 * Fetch tasks with optional filters, search, sorting, and pagination
 */
export const getTasks = async (paramsOrStatus?: string | TaskQueryParams): Promise<Task[]> => {
  try {
    const queryParams: Record<string, any> = {};

    if (typeof paramsOrStatus === 'string') {
      if (paramsOrStatus && paramsOrStatus !== 'all' && paramsOrStatus !== 'All') {
        queryParams.status = paramsOrStatus.toLowerCase().replace(/\s+/g, '_');
      }
    } else if (paramsOrStatus && typeof paramsOrStatus === 'object') {
      if (paramsOrStatus.status && paramsOrStatus.status !== 'all' && paramsOrStatus.status !== 'All') {
        queryParams.status = paramsOrStatus.status.toLowerCase().replace(/\s+/g, '_');
      }
      if (paramsOrStatus.priority && paramsOrStatus.priority !== 'all' && paramsOrStatus.priority !== 'All') {
        queryParams.priority = paramsOrStatus.priority.toLowerCase();
      }
      if (paramsOrStatus.search) {
        queryParams.search = paramsOrStatus.search.trim();
      }
      if (paramsOrStatus.sortBy) {
        queryParams.sortBy = paramsOrStatus.sortBy;
      }
      if (paramsOrStatus.sortOrder) {
        queryParams.sortOrder = paramsOrStatus.sortOrder;
      }
      if (paramsOrStatus.page) {
        queryParams.page = paramsOrStatus.page;
      }
      if (paramsOrStatus.limit) {
        queryParams.limit = paramsOrStatus.limit;
      }
    }

    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks', { params: queryParams });
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Create a new task
 */
export const createTask = async (payload: CreateTaskInput): Promise<Task> => {
  try {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', payload);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data as unknown as Task;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Partial update for a task (title, description, status, priority, assignedTo, dueDate)
 */
export const updateTask = async (id: string, payload: UpdateTaskInput): Promise<Task> => {
  try {
    const formattedPayload: Record<string, any> = {};
    if (payload.title !== undefined) formattedPayload.title = payload.title.trim();
    if (payload.description !== undefined) formattedPayload.description = payload.description.trim();
    if (payload.status !== undefined) {
      formattedPayload.status = payload.status.toLowerCase().replace(/\s+/g, '_');
    }
    if (payload.priority !== undefined) {
      formattedPayload.priority = payload.priority.toLowerCase();
    }
    if (payload.assignedTo !== undefined) formattedPayload.assignedTo = payload.assignedTo;
    if (payload.dueDate !== undefined) formattedPayload.dueDate = payload.dueDate;

    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}`, formattedPayload);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data as unknown as Task;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Quick status update helper
 */
export const updateTaskStatus = async (id: string, status: string): Promise<Task> => {
  return updateTask(id, { status });
};

/**
 * Delete task
 */
export const deleteTask = async (id: string): Promise<{ success: boolean; message: string; id: string }> => {
  try {
    const response = await apiClient.delete<ApiResponse<{ id: string }>>(`/tasks/${id}`);
    return {
      success: true,
      message: response.data?.message || 'Task deleted successfully',
      id,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Fetch dashboard statistics
 */
export const getTaskStats = async (): Promise<TaskStats> => {
  try {
    const response = await apiClient.get<ApiResponse<TaskStats>>('/tasks/stats');
    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to parse statistics response');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export default {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
  getErrorMessage,
};
