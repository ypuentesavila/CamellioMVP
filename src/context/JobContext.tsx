"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Job, JobStatus, Offer, OfferStatus, Review } from "@/types";
import { jobs as mockJobs } from "@/data/jobs";
import { offers as mockOffers } from "@/data/offers";
import { reviews as mockReviews } from "@/data/reviews";

const JOBS_KEY = "camellio_jobs";
const OFFERS_KEY = "camellio_offers";
const REVIEWS_KEY = "camellio_reviews";

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

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
  createJob: (data: CreateJobData) => Job;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  completeJob: (jobId: string) => void;
  submitOffer: (data: SubmitOfferData) => Offer;
  acceptOffer: (offerId: string) => void;
  rejectOffer: (offerId: string) => void;
  withdrawOffer: (offerId: string) => void;
  counterOffer: (offerId: string, price: number, note: string) => void;
  submitReview: (data: SubmitReviewData) => Review;
}

const JobContext = createContext<JobContextValue | null>(null);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  useEffect(() => {
    setJobs(loadFromStorage(JOBS_KEY, mockJobs));
    setOffers(loadFromStorage(OFFERS_KEY, mockOffers));
    setReviews(loadFromStorage(REVIEWS_KEY, mockReviews));
  }, []);

  useEffect(() => {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

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

  const createJob = useCallback((data: CreateJobData): Job => {
    const now = new Date().toISOString();
    const newJob: Job = {
      ...data,
      id: `j-${Date.now()}`,
      status: "open",
      offerCount: 0,
      images: data.images ?? [],
      createdAt: now,
      updatedAt: now,
    };
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  }, []);

  const updateJobStatus = useCallback((jobId: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status, updatedAt: new Date().toISOString() }
          : j
      )
    );
  }, []);

  const completeJob = useCallback((jobId: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: "completed", updatedAt: new Date().toISOString() }
          : j
      )
    );
  }, []);

  // ─── Offer mutations ─────────────────────────────────────────────────────────

  const submitOffer = useCallback((data: SubmitOfferData): Offer => {
    const now = new Date().toISOString();
    const newOffer: Offer = {
      ...data,
      id: `o-${Date.now()}`,
      status: "pending",
      negotiationRound: 0,
      createdAt: now,
      updatedAt: now,
    };
    setOffers((prev) => [newOffer, ...prev]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === data.jobId
          ? { ...j, offerCount: j.offerCount + 1, updatedAt: now }
          : j
      )
    );
    return newOffer;
  }, []);

  const updateOfferStatus = useCallback(
    (offerId: string, status: OfferStatus) => {
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId
            ? { ...o, status, updatedAt: new Date().toISOString() }
            : o
        )
      );
    },
    []
  );

  const acceptOffer = useCallback(
    (offerId: string) => {
      const offer = offers.find((o) => o.id === offerId);
      if (!offer) return;
      const now = new Date().toISOString();
      setOffers((prev) =>
        prev.map((o) => {
          if (o.jobId !== offer.jobId) return o;
          return {
            ...o,
            status: o.id === offerId ? "accepted" : "rejected",
            updatedAt: now,
          };
        })
      );
      setJobs((prev) =>
        prev.map((j) =>
          j.id === offer.jobId
            ? { ...j, status: "in_progress", acceptedOfferId: offerId, updatedAt: now }
            : j
        )
      );
    },
    [offers]
  );

  const rejectOffer = useCallback(
    (offerId: string) => updateOfferStatus(offerId, "rejected"),
    [updateOfferStatus]
  );

  const withdrawOffer = useCallback(
    (offerId: string) => {
      updateOfferStatus(offerId, "withdrawn");
      const offer = offers.find((o) => o.id === offerId);
      if (offer) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === offer.jobId
              ? {
                  ...j,
                  offerCount: Math.max(0, j.offerCount - 1),
                  updatedAt: new Date().toISOString(),
                }
              : j
          )
        );
      }
    },
    [offers, updateOfferStatus]
  );

  const counterOffer = useCallback(
    (offerId: string, price: number, note: string) => {
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId
            ? {
                ...o,
                status: "negotiating",
                counterOfferPrice: price,
                counterOfferNote: note,
                negotiationRound: o.negotiationRound + 1,
                updatedAt: new Date().toISOString(),
              }
            : o
        )
      );
    },
    []
  );

  // ─── Review mutations ────────────────────────────────────────────────────────

  const submitReview = useCallback((data: SubmitReviewData): Review => {
    const newReview: Review = {
      ...data,
      id: `r-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    return newReview;
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
  if (!ctx) throw new Error("useJobs must be used within JobProvider");
  return ctx;
}
