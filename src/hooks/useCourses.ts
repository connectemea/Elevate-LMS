import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as courseService from "@/services/course.service";
import { message } from "antd";

export function useCourses() {
  const queryClient = useQueryClient();
  const [messageApi] = message.useMessage();

  // Fetch all courses
  const query = useQuery({
    queryKey: ["courses"],
    queryFn: courseService.getCourses,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  // --- Add course mutation ---
  const addCourseMutation = useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      messageApi.success("Course added");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: () => {
      messageApi.error("Failed to add course");
    },
  });

  // --- Delete course mutation ---
  const deleteCourseMutation = useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      messageApi.success("Course deleted");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: () => {
      messageApi.error("Failed to delete course");
    },
  });

  return {
    ...query,

    // ergonomic mutation functions:
    addCourse: addCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,

    // loading states:
    addCourseLoading: addCourseMutation.isPending,
    deleteCourseLoading: deleteCourseMutation.isPending,

    // expose full mutation if needed elsewhere:
    addCourseMutation,
    deleteCourseMutation,
  };
}
