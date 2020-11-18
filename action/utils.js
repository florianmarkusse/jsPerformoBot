import { existsSync } from 'fs';

export const EXTENSIONS_TO_LINT = [
    '.mjs',
    '.js',
];

export const isFileOk = (path) => {
    try {
        if (existsSync(path)) {
        // console.log(`Path: ${path} is valid`);
        return true;
        }
    } catch (err) {
        console.error(err);
    }
    // console.log(`Path: ${path} is not valid`);

    return false;
};

export async function getPullRequestInfo(
{
    graphqlWithAuth, owner, repo, prNumber
}
) {
    const gql = (s) => s.join('');
    return graphqlWithAuth(
        gql`
        query($owner: String!, $name: String!, $prNumber: Int!) {
            repository(owner: $owner, name: $name) {
            pullRequest(number: $prNumber) {
                files(first: 100) {
                nodes {
                    path
                }
                }
                commits(last: 1) {
                nodes {
                    commit {
                    oid
                    }
                }
                }
            }
            }
        }
        `,
        {
        owner,
        name: repo,
        prNumber
        }
    );
}