export const formatDate = (date: string, localeName = 'en-GB',) => (new Date(date))
  .toLocaleDateString(
    localeName,
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  )

export const formatDateDay = (date: string, localeName = 'en-GB',) => (new Date(date))
.toLocaleDateString(
  localeName,
  {
    day: 'numeric'
  }
)

type monthFormatType = "short" | "long" | "narrow";
export const formatMonthsForLocale  =  (date: string, localeName = 'en-GB', monthFormat: monthFormatType = "short")  => {
  const format = new Intl
    .DateTimeFormat(localeName, { month: monthFormat }).format;
  return format(new Date(date))
};