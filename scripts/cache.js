const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const aircraftDirectory = path.join(process.cwd(), 'data/aircraft')
const docsDirectory = path.join(process.cwd(), 'data/docs')
const postsDirectory = path.join(process.cwd(), 'data/posts')

const getPosts = () => {
  const postsNames = fs.readdirSync(postsDirectory)

  const allPosts = postsNames.map(postName => {
    const id = postName

    const pathToPostFolder = path.join(postsDirectory, postName);
    const pathToFullPost = path.join(pathToPostFolder, 'post.md')

    const postContent = fs.readFileSync(pathToFullPost, 'utf8')
    const postData = matter(postContent)

    return {
      id,
      ...postData.data,
      content: postData.content
    }
  })

  return allPosts;
}

const getDocs = () => {
  const docsNames = fs.readdirSync(docsDirectory)

  let allDocs = {
    active: [],
    notActive: []
  }

  docsNames.forEach(id => {
    const pathToDocFolder = path.join(docsDirectory, id);

    const pathToFullDoc = path.join(pathToDocFolder, 'full.md')
    const pathToSummary = path.join(pathToDocFolder, 'summary.md')

    const docContents = fs.readFileSync(pathToFullDoc, 'utf8')
    const docData = matter(docContents);

    if (docData.data.active) {
      allDocs.active.push({ id: id, ...docData.data, content: docData.content, isSummary: false })
      if (docData.data.summaryExists) {
        const summaryContents = fs.readFileSync(pathToSummary, 'utf8')
        const summaryData = matter(summaryContents)
        allDocs.active.push({ id: id, ...summaryData.data, content: summaryData.content, isSummary: true })
      }
    } else {
      allDocs.notActive.push({ id: id, ...docData.data })
    }

  })

  return allDocs;
}

const getAircraft = () => {
  const allAircraft = fs.readdirSync(aircraftDirectory)
  const allAircraftData = allAircraft.map(aircraftName => {
    const aircraftRawData = fs.readFileSync(`${aircraftDirectory}/${aircraftName}/info.json`, 'utf8')
    const aircraftInfo = JSON.parse(aircraftRawData);

    return {
      aircraftInfo
    }
  })

  return allAircraftData;
}


function getAllData () {
  return JSON.stringify({
    posts: getPosts(),
    docs: getDocs()
  })
}

try {
  fs.readdirSync('data/cache')
} catch (e) {
  fs.mkdirSync('data/cache')
}

fs.writeFile('data/cache/data.json', getAllData(), function (err) {
  if (err) return console.log(err);
  console.log('Posts cached.');
})