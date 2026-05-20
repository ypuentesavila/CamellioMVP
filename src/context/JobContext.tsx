"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Job, JobStatus, Offer, OfferStatus, Review } from "@/types";
import { api, getToken } from "@/lib/api";

interface CreateJobData {
  employerId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: { min: number; max: number };
  urgency: Job["urgency"];
  images?: string[];
}

interface SubmitOfferData {
  jobId: string;
  workerId: string;
  employerId: string;
  proposedPrice: number;
  estimatedDuration: string;
  message: string;
}

interface SubmitReviewData {
  jobId: string;
  offerId: string;
  authorId: string;
  targetId: string;
  rating: number;
  comment: string;
}

interface JobContextValue {
  jobs: Job[];
  offers: Offer[];
  reviews: Review[];
  getJobById: (id: string) => Job | undefined;
  getOffersByJob: (jobId: string) => Offer[];
  getOffersByWorker: (workerId: string) => Offer[];
  getReviewsByWorker: (workerId: string) => Review[];
  getReviewsByJob: (jobId: string) => Review[];
  getWorkerRating: (workerId: string) => { average: number; count: number };
  hasReviewed: (jobId: string, authorId: string) => boolean;
  createJob: (data: CreateJobData) => Promise<Job>;
  updateJobStatus: (jobId: string, status: JobStatus) => Promise<void>;
  completeJob: (jobId: string) => Promise<void>;
  submitOffer: (data: SubmitOfferData) => Promise<void>;
  acceptOffer: (offerId: string) => Promise<void>;
  rejectOffer: (offerId: string) => Promise<void>;
  withdrawOffer: (offerId: string) => Promise<void>;
  counterOffer: (offerId: string, price: number, note: string) => Promise<void>;
  submitReview: (data: SubmitReviewData) => Promise<Review>;
}

const JobContext = createContext<JobContextValue | null>(null);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    api.get<Job[]>('/jobs').then(setJobs).catch(() => {});
    if (getToken()) {
      api.get<Offer[]>('/offers').then(setOffers).catch(() => {});
      api.get<Review[]>('/reviews').then(setReviews).catch(() => {});
    }
  }, []);

  // ─── Queries ────────────────────────────────────────────────────────────────

  const getJobById = useCallback(
    (id: string) => jobs.find((j) => j.id === id),
    [jobs]
  );

  const getOffersByJob = useCallback(
    (jobId: string) => offers.filter((o) => o.jobId === jobId),
    [offers]
  );

  const getOffersByWorker = useCallback(
    (workerId: string) => offers.filter((o) => o.workerId === workerId),
    [offers]
  );

  const getReviewsByWorker = useCallback(
    (workerId: string) =>
      reviews
        .filter((r) => r.targetId === workerId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [reviews]
  );

  const getReviewsByJob = useCallback(
    (jobId: string) => reviews.filter((r) => r.jobId === jobId),
    [reviews]
  );

  const getWorkerRating = useCallback(
    (workerId: string) => {
      const workerReviews = reviews.filter((r) => r.targetId === workerId);
      if (workerReviews.length === 0) return { average: 0, count: 0 };
      const average =
        workerReviews.reduce((sum, r) => sum + r.rating, 0) /
        workerReviews.length;
      return { average: Math.round(average * 10) / 10, count: workerReviews.length };
    },
    [reviews]
  );

  const hasReviewed = useCallback(
    (jobId: string, authorId: string) =>
      reviews.some((r) => r.jobId === jobId && r.authorId === authorId),
    [reviews]
  );

  // ─── Job mutations ──────────────────────────────────────────────────────────

  const createJob = useCallback(async (data: CreateJobData): Promise<Job> => {
    const job = await api.post<Job>('/jobs', data);
    setJobs((prev) => [job, ...prev]);
    return job;
  }, []);

  const updateJobStatus = useCallback(async (jobId: string, status: JobStatus) => {
    const job = await api.patch<Job>(`/jobs/${jobId}/status`, { status });
    setJobs((prev) => prev.map((j) => (j.id === jobId ? job : j)));
  }, []);

  const completeJob = useCallback(async (jobId: string) => {
    await updateJobStatus(jobId, 'completed');
  }, [updateJobStatus]);

  // ─── Offer mutations ─────────────────────────────────────────────────────────

  const submitOffer = useCallback(async (data: SubmitOfferData): Promise<void> => {
    const offer = await api.post<Offer>('/offers', data);
    setOffers((prev) => [offer, ...prev]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === data.jobId
          ? { ...j, offerCount: j.offerCount + 1, updatedAt: offer.updatedAt }
          : j
      )
    );
  }, []);

  const acceptOffer = useCallback(async (offerId: string) => {
    await api.post<{ success: boolean }>(`/offers/${offerId}/accept`, {});
    const jobId = offers.find((o) => o.id === offerId)?.jobId ?? "";
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) return { ...o, status: 'accepted' as OfferStatus };
        if (o.jobId === jobId && o.id !== offerId)
          return { ...o, status: 'rejected' as OfferStatus };
        return o;
      })
    );
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: 'in_progress' as JobStatus, acceptedOfferId: offerId }
          : j
      )
    );
  }, [offers]);

  const rejectOffer = useCallback(async (offerId: string) => {
    await api.post<{ success: boolean }>(`/offers/${offerId}/reject`, {});
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'rejected' as OfferStatus } : o))
    );
  }, []);

  const withdrawOffer = useCallback(async (offerId: string) => {
    await api.post<{ success: boolean }>(`/offers/${offerId}/withdraw`, {});
    const jobId = offers.find((o) => o.id === offerId)?.jobId ?? "";
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'withdrawn' as OfferStatus } : o))
    );
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, offerCount: Math.max(0, j.offerCount - 1) }
          : j
      )
    );
  }, [offers]);

  const counterOffer = useCallback(
    async (offerId: string, price: number, note: string) => {
      const offer = await api.post<Offer>(`/offers/${offerId}/counter`, { price, note });
      setOffers((prev) => prev.map((o) => (o.id === offerId ? offer : o)));
    },
    []
  );

  // ─── Review mutations ────────────────────────────────────────────────────────

  const submitReview = useCallback(async (data: SubmitReviewData): Promise<Review> => {
    const review = await api.post<Review>('/reviews', data);
    setReviews((prev) => [review, ...prev]);
    return review;
  }, []);

  return (
    <JobContext.Provider
      value={{
        jobs,
        offers,
        reviews,
        getJobById,
        getOffersByJob,
        getOffersByWorker,
        getReviewsByWorker,
        getReviewsByJob,
        getWorkerRating,
        hasReviewed,
        createJob,
        updateJobStatus,
        completeJob,
        submitOffer,
        acceptOffer,
        rejectOffer,
        withdrawOffer,
        counterOffer,
        submitReview,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error('useJobs must be used within JobProvider');
  return ctx;
}
