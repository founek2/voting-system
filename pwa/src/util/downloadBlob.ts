export function downloadBlob(content: string, filename: string, contentType: string) {
    const blob = new Blob([
        new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
        content
    ], { type: contentType });
    const url = URL.createObjectURL(blob);

    const pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
    pom.remove()
}
