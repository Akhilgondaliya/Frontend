import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    // Fall back to empty string if VITE_API_URL is undefined (relying on vite server proxy)
    baseUrl: import.meta.env.VITE_API_URL || '' 
  }),
  endpoints: (builder) => ({
    // POST /api/scan -> Body: { url }
    scanUrl: builder.mutation({
      query: (body) => ({
        url: '/api/scan',
        method: 'POST',
        body,
      }),
    }),
    // POST /api/scan-qr -> Body: FormData (qr_image)
    scanQr: builder.mutation({
      query: (formData) => ({
        url: '/api/scan-qr',
        method: 'POST',
        body: formData,
        // RTK Query/Fetch handles FormData content headers automatically
      }),
    }),
    // GET /api/report?url=... -> returns PDF report blob
    downloadReport: builder.query({
      query: (url) => ({
        url: `/api/report?url=${encodeURIComponent(url)}`,
        responseHandler: async (response) => {
          const blob = await response.blob()
          return blob
        },
      }),
    }),
    // POST /api/scan-mail -> Body: { sender, subject, body }
    scanMail: builder.mutation({
      query: (body) => ({
        url: '/api/scan-mail',
        method: 'POST',
        body,
      }),
    }),
    // POST /api/scan-file -> Body: FormData (file)
    scanFile: builder.mutation({
      query: (formData) => ({
        url: '/api/scan-file',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
})

export const { 
  useScanUrlMutation, 
  useScanQrMutation,
  useScanMailMutation,
  useScanFileMutation,
  useLazyDownloadReportQuery
} = apiSlice
