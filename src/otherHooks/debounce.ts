type Func = (...args: any[]) => any;

export function debounce<F extends Func>(
    func: F,
    wait: number,
    immediate = false,
): F & { cancel: () => void } {
    let timeout: ReturnType<typeof setTimeout> | null;

    const debounced = function (this: any, ...args: Parameters<F>) {
        const context = this;

        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && !timeout;

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };

    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced as F & { cancel: () => void };
}
