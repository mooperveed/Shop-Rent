export function formatTimestampToDate(timestamp) {
  // return timestamp;
  // Step 1: Convert the Firestore Timestamp to a JavaScript Date object
  const date = timestamp.toDate();

  // Step 2: Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  // Step 3: Format and return as "dd-mm-yyyy"
  return `${day}-${month}-${year}`;
}
