export type EventSummary = {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  badgeIcon: string;
  latitude: number;
  longitude: number;
  startTime: string;
  endTime: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  capacity: number;
  organizerId: string;
  isPaid: boolean;
  engagementScore: number;
};
