import fs from 'fs';
import path from 'path';

const TOKEN = process.env.GH_TOKEN;
const OWNER = 'yoth78';
const REPO = 'merchant-';
const BRANCH = 'main';

async function ghRequest(endpoint, method = 'GET', body = null) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'KoyeMart-Deployer',
    'X-GitHub-Api-Version': '2022-11-28'
  };
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub API ${method} ${endpoint} failed (${res.status}): ${errText}`);
  }
  return res.json();
}

function getAllFiles(currentDir, fileList = []) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'local-storage.json' || file.startsWith('push-to-github')) {
      continue;
    }
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function uploadProject() {
  console.log(`Starting direct Git Data API push to ${OWNER}/${REPO}...`);

  // 1. Get latest commit SHA on main
  let baseTreeSha = null;
  let parentCommitSha = null;
  try {
    const refData = await ghRequest(`/git/ref/heads/${BRANCH}`);
    parentCommitSha = refData.object.sha;
    const commitData = await ghRequest(`/git/commits/${parentCommitSha}`);
    baseTreeSha = commitData.tree.sha;
    console.log(`Found existing branch ${BRANCH} at commit ${parentCommitSha}`);
  } catch (err) {
    console.log(`Branch ${BRANCH} does not exist yet or is empty. Initializing brand new root tree.`);
  }

  // 2. Scan project files and create Blobs
  const rootDir = process.cwd();
  const filePaths = getAllFiles(rootDir);
  console.log(`Found ${filePaths.length} files to commit.`);

  const tree = [];
  let counter = 0;

  for (const filePath of filePaths) {
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const contentBuffer = fs.readFileSync(filePath);
    const contentBase64 = contentBuffer.toString('base64');

    const blobData = await ghRequest('/git/blobs', 'POST', {
      content: contentBase64,
      encoding: 'base64'
    });

    tree.push({
      path: relativePath,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha
    });

    counter++;
    if (counter % 20 === 0 || counter === filePaths.length) {
      console.log(`Uploaded ${counter}/${filePaths.length} files...`);
    }
  }

  // 3. Create Tree
  console.log('Creating Git tree object...');
  const treeBody = { tree };
  if (baseTreeSha) {
    treeBody.base_tree = baseTreeSha;
  }
  const treeResult = await ghRequest('/git/trees', 'POST', treeBody);
  console.log('Created Tree SHA:', treeResult.sha);

  // 4. Create Commit
  console.log('Creating Git commit...');
  const commitPayload = {
    message: 'Initial release: KoyeMart Multi-Merchant E-Commerce Platform and Mobile App',
    tree: treeResult.sha,
    parents: parentCommitSha ? [parentCommitSha] : []
  };
  const newCommit = await ghRequest('/git/commits', 'POST', commitPayload);
  console.log('Created Commit SHA:', newCommit.sha);

  // 5. Update or Create Ref
  console.log(`Updating ref refs/heads/${BRANCH}...`);
  if (parentCommitSha) {
    await ghRequest(`/git/refs/heads/${BRANCH}`, 'PATCH', {
      sha: newCommit.sha,
      force: true
    });
  } else {
    await ghRequest('/git/refs', 'POST', {
      ref: `refs/heads/${BRANCH}`,
      sha: newCommit.sha
    });
  }

  console.log(`\n🎉 Successfully pushed KoyeMart to https://github.com/${OWNER}/${REPO}`);
}

uploadProject().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
