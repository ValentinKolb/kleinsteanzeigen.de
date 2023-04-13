/**
 * Extracts the text content from an HTML string.
 * @param {string} html - The HTML string to extract text from.
 * @returns {string} The extracted text content.
 */
export function extractFromHtmlString(html: string) {
    const span = document.createElement('span')
    span.innerHTML = html;
    const children = span.querySelectorAll('*') as NodeListOf<HTMLElement>
    for (var i = 0; i < children.length; i++) {
        if (children[i].textContent)
            children[i].textContent += ' '
        else
            children[i].innerText += ' '
    }
    return [span.textContent || span.innerText].toString().replace(/ +/g, ' ')
}

/**
 * Converts a length value from centimeters to meters or kilometers.
 * @param {number} cm - The length value in centimeters.
 * @returns {string} The length value in meters or kilometers, formatted as a string.
 */
export function convertLength(cm: number): string {
    if (cm < 100) {
        return `${cm.toFixed(0)}cm`;
    } else if (cm >= 100 && cm < 1000) {
        const meters: number = cm / 100;
        return `${meters.toFixed(0)}m`;
    } else {
        const kilometers: number = cm / 100000;
        return `${kilometers.toFixed(0)}km`;
    }
}

/**
 * Converts a weight value from kilograms to grams or metric tons.
 * @param {number} kg - The weight value in kilograms.
 * @returns {string} The weight value in grams or metric tons, formatted as a string.
 */
export function convertWeight(kg: number): string {
    if (kg < 1) {
        const grams: number = kg * 1000;
        return `${grams.toFixed(0)}g`;
    } else if (kg >= 1 && kg < 1000) {
        return `${kg.toFixed(2)}kg`;
    } else {
        const tonnes: number = kg / 1000;
        return `${tonnes.toFixed(2)}t`;
    }
}

/**
 * Removes empty tags from an HTML string.
 * @param {string} html - The HTML string to remove empty tags from.
 * @returns {string} The HTML string with empty tags removed.
 */
export function removeEmptyTagsFromHtmlString(html: string): string {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    const emptyTags = doc.querySelectorAll(":empty")
    emptyTags.forEach((tag) => tag.parentNode?.removeChild(tag))

    return doc?.body ? doc.body.innerHTML : ""
}

/**
 * Throttles a function to a maximum number of calls per second.
 * @param {(...args: any[]) => any} func - The function to throttle.
 * @param {number} limit - The maximum number of calls per second.
 * @returns {(...args: any[]) => any} A new function that wraps the original function and enforces the throttle limit.
 */
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
    let inThrottle = false;
    let lastResult: ReturnType<T> | undefined;
    return ((...args: Parameters<T>) => {
        if (!inThrottle) {
            inThrottle = true;
            lastResult = func(...args);
            setTimeout(() => {
                inThrottle = false;
            }, 1000 / limit);
        }
        return lastResult;
    }) as T;
}


/**
 * Calculates the bounding box for a given center point and distance
 * @param {number} latitude The latitude of the center point
 * @param {number} longitude The longitude of the center point
 * @param {number} distanceKm The distance in kilometers
 */
export function calculateBoundingBox(latitude: number | string, longitude: number | string, distanceKm: number) {
    const earthRadiusKm = 6371;

    latitude = parseFloat(latitude as string);
    longitude = parseFloat(longitude as string);

    // Breitengrad- und Längengrad-Abstände in Bogenmaß
    const dLatRad = distanceKm / earthRadiusKm;
    const dLonRad = distanceKm / (earthRadiusKm * Math.cos((Math.PI * latitude) / 180));

    // Umrechnung von Bogenmaß in Grad
    const dLatDeg = (dLatRad * 180) / Math.PI;
    const dLonDeg = (dLonRad * 180) / Math.PI;

    // Berechnung der minimalen und maximalen Breiten- und Längengrade
    const minLat = latitude - dLatDeg;
    const maxLat = latitude + dLatDeg;
    const minLon = longitude - dLonDeg;
    const maxLon = longitude + dLonDeg;

    return {
        minLatitude: minLat,
        maxLatitude: maxLat,
        minLongitude: minLon,
        maxLongitude: maxLon,
    };
}
