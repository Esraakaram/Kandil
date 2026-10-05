import { Suspense } from 'react';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'قنديل للاستثمار العقاري | Kandil Real Estate',
  description: 'شركة قنديل للاستثمار العقاري وإدارة المشروعات تأسست في 2001 بخبرة تقارب إثنان وعشرون عاماً في مجال البناء والتشييد والمقاولات العامة بالمدن الجديدة',
  icons: {
    icon: '/assets/Images/k1.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </head>
      <body className="bg-[#fcfdfd] text-[#1e293b] font-['Cairo',sans-serif] antialiased">
        <Suspense fallback={null}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
