import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { recordLocalScan } from "../utils/localStats";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // Fall back to empty string if VITE_API_URL is undefined (relying on vite server proxy)
    baseUrl: import.meta.env.VITE_API_URL || "",
  }),
  tagTypes: ["Stats"],
  endpoints: (builder) => ({
    // POST /api/scan -> Body: { url }
    scanUrl: builder.mutation({
      query: (body) => ({
        url: "/api/scan",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Stats"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          recordLocalScan(data?.score ?? 0, { scanType: "url" });
          dispatch(apiSlice.endpoints.getStats.initiate(undefined, { forceRefetch: true }));
        } catch {
          // Ignore failed scans
        }
      },
    }),
    // POST /api/scan-qr -> Body: FormData (qr_image)
    scanQr: builder.mutation({
      query: (formData) => ({
        url: "/api/scan-qr",
        method: "POST",
        body: formData,
        // RTK Query/Fetch handles FormData content headers automatically
      }),
      invalidatesTags: ["Stats"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          recordLocalScan(data?.score ?? 0, { scanType: "qr" });
          dispatch(apiSlice.endpoints.getStats.initiate(undefined, { forceRefetch: true }));
        } catch {
          // Ignore failed scans
        }
      },
    }),
    // GET /api/report?url=... -> returns PDF report blob
    downloadReport: builder.query({
      query: (url) => ({
        url: `/api/report?url=${encodeURIComponent(url)}`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    // POST /api/scan-mail -> Body: { sender, subject, body }
    scanMail: builder.mutation({
      query: (body) => ({
        url: "/api/scan-mail",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Stats"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          recordLocalScan(data?.score ?? 0, { scanType: "mail" });
          dispatch(apiSlice.endpoints.getStats.initiate(undefined, { forceRefetch: true }));
        } catch {
          // Ignore failed scans
        }
      },
    }),
    // POST /api/scan-file -> Body: FormData (file)
    scanFile: builder.mutation({
      query: (formData) => ({
        url: "/api/scan-file",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Stats"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          recordLocalScan(data?.score ?? 0, { scanType: "file" });
          dispatch(apiSlice.endpoints.getStats.initiate(undefined, { forceRefetch: true }));
        } catch {
          // Ignore failed scans
        }
      },
    }),
    // GET /api/stats -> returns activity counters
    getStats: builder.query({
      query: () => "/api/stats",
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useScanUrlMutation,
  useScanQrMutation,
  useScanMailMutation,
  useScanFileMutation,
  useLazyDownloadReportQuery,
  useGetStatsQuery,
} = apiSlice;
