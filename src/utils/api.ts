import { apiRequest } from "@/contexts/AuthContext";

export const studentApi = {
  dashboard:    () => apiRequest("/student/dashboard"),
  campaigns:    () => apiRequest("/student/campaigns"),
  tasks:        () => apiRequest("/student/tasks"),
  task:         (id: string) => apiRequest(`/student/tasks/${id}`),
  quizzes:      () => apiRequest("/student/quizzes"),
  quiz:         (id: string) => apiRequest(`/student/quizzes/${id}`),
  certificates: () => apiRequest("/student/certificates"),
  marketplace:  () => apiRequest("/student/marketplace"),
  donations:    () => apiRequest("/student/donations/history"),
  profile:      () => apiRequest("/student/profile"),
  idCard:       () => apiRequest("/student/id-card"),
  activity:     () => apiRequest("/student/activity"),
  progress:     () => apiRequest("/student/progress"),
  submitTask: (id: string, formData: FormData) => {
    const token = localStorage.getItem("token");
    return fetch(`http://localhost:5000/api/student/tasks/${id}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(r => { if (!r.ok) throw new Error("Submit failed"); return r.json(); });
  },
  submitQuiz: (id: string, answers: Record<number, number>, score: number) =>
    apiRequest(`/student/quizzes/${id}/submit`, { method: "POST", body: JSON.stringify({ answers, score }) }),
};

export const publicApi = {
  campaigns:   () => apiRequest("/campaigns"),
  marketplace: () => apiRequest("/marketplace"),
  donations:   () => apiRequest("/donations"),
};
