export async function fetchHoliday(month, year) {
    let month_api = month + 1;
    try {
        const response = await fetch(`https://dayoffapi.vercel.app/api?month=${month_api}&year=${year}`);
        if (!response.ok) {
            throw new Error("The holiday date not found");
        }
        const data = await response.json();

        const holidaysWithDateObjects = data.map(holiday => ({
            ...holiday,
            tanggal: new Date(holiday.tanggal) // Convert string to Date object
        }));
        console.log(holidaysWithDateObjects);
        return holidaysWithDateObjects; // Return the data with Date objects
    } catch (error) {
        console.error('Error fetching holiday data: ', error);
    }
}
