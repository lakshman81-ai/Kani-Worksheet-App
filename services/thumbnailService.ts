/**
 * ThumbnailService - Dynamic image fetching for questions
 * Port from OLD MCQ App's ThumbnailManager
 */

// Image sources
const IMAGE_SOURCES = {
    unsplash: (keyword: string) =>
        `https://source.unsplash.com/400x300/?${encodeURIComponent(keyword)}`,
    picsum: () =>
        `https://picsum.photos/400/300?random=${Math.random()}`,
};

// Cache for loaded images
const imageCache: Map<string, string> = new Map();

// Keywords to filter from search
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'what', 'which', 'who',
    'how', 'when', 'where', 'why', 'do', 'does', 'did', 'can', 'could',
    'will', 'would', 'should', 'may', 'might', 'must', 'shall', 'of', 'in',
    'to', 'for', 'with', 'on', 'at', 'by', 'from', 'as', 'into', 'through',
    'during', 'before', 'after', 'above', 'below', 'between', 'under',
    'this', 'that', 'these', 'those', 'it', 'its', 'he', 'she', 'they',
    'we', 'you', 'i', 'me', 'my', 'your', 'his', 'her', 'their', 'our'
]);

/**
 * Extract meaningful keywords from question text
 */
export function extractKeywords(text: string): string[] {
    // Remove special characters and split
    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOP_WORDS.has(word));

    // Return first 3 unique words
    const unique = [...new Set(words)];
    return unique.slice(0, 3);
}

/**
 * Generate a cache key from question
 */
function getCacheKey(questionText: string): string {
    const keywords = extractKeywords(questionText);
    return keywords.join('-') || 'default';
}

/**
 * Validate if image URL is loadable
 */
export function validateImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;

        // Timeout after 5 seconds
        setTimeout(() => resolve(false), 5000);
    });
}

/**
 * Fetch a relevant thumbnail for a question
 */
export async function fetchThumbnail(questionText: string): Promise<string | null> {
    const cacheKey = getCacheKey(questionText);

    // Check cache first
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey) || null;
    }

    const keywords = extractKeywords(questionText);
    const searchTerm = keywords.join(' ') || 'education learning';

    try {
        // Try Unsplash first
        const unsplashUrl = IMAGE_SOURCES.unsplash(searchTerm);
        const isValid = await validateImage(unsplashUrl);

        if (isValid) {
            imageCache.set(cacheKey, unsplashUrl);
            return unsplashUrl;
        }

        // Fallback to Picsum
        const picsumUrl = IMAGE_SOURCES.picsum();
        imageCache.set(cacheKey, picsumUrl);
        return picsumUrl;

    } catch (error) {
        console.warn('Failed to fetch thumbnail:', error);
        return null;
    }
}

/**
 * Get thumbnail with fallback - returns either cached, fetched, or placeholder
 */
export function getThumbnailUrl(
    questionText: string,
    existingImageUrl?: string
): string {
    // If question already has an image, use it
    if (existingImageUrl && existingImageUrl.trim()) {
        return existingImageUrl;
    }

    // Check cache
    const cacheKey = getCacheKey(questionText);
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey) || '';
    }

    // Return placeholder (will be replaced async)
    return '';
}

/**
 * Preload thumbnails for a list of questions
 */
export async function preloadThumbnails(
    questions: Array<{ text: string; imageUrl?: string }>
): Promise<void> {
    const promises = questions
        .filter(q => !q.imageUrl)
        .slice(0, 5) // Limit to first 5 without images
        .map(q => fetchThumbnail(q.text));

    await Promise.allSettled(promises);
}

/**
 * Clear thumbnail cache
 */
export function clearThumbnailCache(): void {
    imageCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
    return {
        size: imageCache.size,
        keys: Array.from(imageCache.keys()),
    };
}
