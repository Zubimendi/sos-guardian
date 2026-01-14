export const now = () => Date.now();

export const formatPhoneNumber = (phone: string) => phone.replace(/[^\d+]/g, "");

export const minutesToMs = (minutes: number) => minutes * 60 * 1000;

