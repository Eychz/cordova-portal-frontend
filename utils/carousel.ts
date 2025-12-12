import type { Post } from './../data/adminData';

// Select up to `n` posts per type, preferring 'high' priority and most recent posts.
export function selectTopPostsByType(posts: Post[], perType = 2): Post[] {
    const sortByDateDesc = (arr: Post[]) => arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const types: Post['type'][] = ['news', 'announcement', 'event'];
    const selected: Post[] = [];

    for (const type of types) {
        const postsOfType = posts.filter(p => p.type === type);
        if (!postsOfType || postsOfType.length === 0) continue;
        const high = sortByDateDesc(postsOfType.filter(p => p.priority === 'high'));
        if (high.length >= perType) selected.push(...high.slice(0, perType));
        else {
            const other = sortByDateDesc(postsOfType.filter(p => p.priority !== 'high'));
            selected.push(...[...high, ...other].slice(0, perType));
        }
    }

    return selected;
}

export default selectTopPostsByType;
