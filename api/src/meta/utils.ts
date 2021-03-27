
export function idOrClassName(id: string, columnNames: any = {}): [string, any] {
    const numParsed = parseInt(id)

    if (isNaN(numParsed)) {
        return [columnNames.classname || 'classname', id]
    }
    
    return [columnNames.id || 'id', numParsed]
}