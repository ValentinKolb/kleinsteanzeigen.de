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