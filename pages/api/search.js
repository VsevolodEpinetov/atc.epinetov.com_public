import { getAllData } from '../../lib/allData'

const data = getAllData();


const getRidOfTrash = (string, stringToSplit) => {
  return string.replace(/\r\n/g, ' ')
  .replace(/\r/g, '')
  .replace(/\n/g, '')
  .replace(/#####/g, '')
  .replace(/####/g, '')
  .replace(/###/g, '')
  .replace(/\*\*/g, '')
  .replace(/__/g, '')
  .replace(/<[^>]*>/g, '')
  .replace(/\\/g, '')
  .toLowerCase()
  .split(stringToSplit);
}

export default (req, res) => {
  let test = 1;
  let results = [];

  // POSTS
  data.posts.forEach(post => {
    let wasAdded = false;

    // Check title
    if (post.title.toLowerCase().includes(req.query.q.toLowerCase())) {

      let temp = {
        title: post.title,
        id: post.id,
        type: post.type,
        date: post.date
      }
      if (post.link) temp.link = post.link

      results.push(temp);
      wasAdded = true;
    }

    // Check body of a post. We should check and display ALL matchings even inside of 1 post

    if (post.content.toLowerCase().includes(req.query.q.toLowerCase())) {
      // Post was not already added to the results
      if (!wasAdded) {
        let temp = {
          type: 'post',
          title: post.title,
          id: post.id,
          postType: post.type,
          date: post.date
        }
        if (post.link) temp.link = post.link

        results.push(temp);
      }

      let id = results.length - 1;

      results[id].resultsInContents = [];

      let splittedText = getRidOfTrash(post.content, req.query.q.toLowerCase())

      splittedText.forEach((part, partID) => {
        if (partID !== (splittedText.length - 1)) {
          let partBefore = '';
          let partAhead = '';

          partBefore = splittedText[partID];
          partAhead = splittedText[partID + 1];

          const halfOfAmountOfSymbolsInResult = 50;



          if (partBefore.length < halfOfAmountOfSymbolsInResult) {
            let stepsBeforeFallingOutOfArray = partID + 1;
            let currentStep = 1;

            while (partBefore.length < halfOfAmountOfSymbolsInResult && currentStep < stepsBeforeFallingOutOfArray) {
              partBefore = splittedText[partID - currentStep] + req.query.q.toLowerCase() + partBefore;
              currentStep++;
            }
          }

          if (partBefore.length > halfOfAmountOfSymbolsInResult) partBefore = '...' + partBefore.slice(partBefore.length - halfOfAmountOfSymbolsInResult);

          if (partAhead.length < halfOfAmountOfSymbolsInResult) {
            let stepsBeforeFallingOutOfArray = splittedText.length - partID - 1;

            let currentStep = 1;
            while (partAhead.length < halfOfAmountOfSymbolsInResult && currentStep < stepsBeforeFallingOutOfArray) {
              partAhead = partAhead + req.query.q.toLowerCase() + splittedText[partID + 1 + currentStep];
              currentStep++;
            }
          }
          if (partAhead.length > halfOfAmountOfSymbolsInResult) partAhead = partAhead.slice(0, halfOfAmountOfSymbolsInResult) + '...'

          results[id].resultsInContents.push({
            stringBefore: partBefore,
            stringPast: partAhead,
            searchedFor: req.query.q.toLowerCase()
          })
        }
      })
    }

  })


  // DOCS
  data.docs.active.forEach(post => {
    let wasAdded = false;

    // Check title
    if (post.title.toLowerCase().includes(req.query.q.toLowerCase())) {

      let temp = {
        title: post.title,
        id: post.id,
        type: post.type,
        date: post.date
      }
      if (post.link) temp.link = post.link

      results.push(temp);
      wasAdded = true;
    }

    // Check body of a post. We should check and display ALL matchings even inside of 1 post

    if (post.content.toLowerCase().includes(req.query.q.toLowerCase())) {
      // Post was not already added to the results
      if (!wasAdded) {
        let temp = {
          type: 'docs',
          title: post.title,
          id: post.id,
          postType: post.type,
          date: post.date
        }
        if (post.link) temp.link = post.link

        results.push(temp);
      }

      let id = results.length - 1;

      results[id].resultsInContents = [];

      let splittedText = getRidOfTrash(post.content, req.query.q.toLowerCase())


      splittedText.forEach((part, partID) => {
        if (partID !== (splittedText.length - 1)) {
          let partBefore = '';
          let partAhead = '';

          partBefore = splittedText[partID];
          partAhead = splittedText[partID + 1];

          const halfOfAmountOfSymbolsInResult = 50;



          if (partBefore.length < halfOfAmountOfSymbolsInResult) {
            let stepsBeforeFallingOutOfArray = partID + 1;
            let currentStep = 1;

            while (partBefore.length < halfOfAmountOfSymbolsInResult && currentStep < stepsBeforeFallingOutOfArray) {
              partBefore = splittedText[partID - currentStep] + req.query.q.toLowerCase() + partBefore;
              currentStep++;
            }
          }

          if (partBefore.length > halfOfAmountOfSymbolsInResult) partBefore = '...' + partBefore.slice(partBefore.length - halfOfAmountOfSymbolsInResult);

          if (partAhead.length < halfOfAmountOfSymbolsInResult) {
            let stepsBeforeFallingOutOfArray = splittedText.length - partID - 1;

            let currentStep = 1;
            while (partAhead.length < halfOfAmountOfSymbolsInResult && currentStep < stepsBeforeFallingOutOfArray) {
              partAhead = partAhead + req.query.q.toLowerCase() + splittedText[partID + 1 + currentStep];
              currentStep++;
            }
          }
          if (partAhead.length > halfOfAmountOfSymbolsInResult) partAhead = partAhead.slice(0, halfOfAmountOfSymbolsInResult) + '...'

          results[id].resultsInContents.push({
            stringBefore: partBefore,
            stringPast: partAhead,
            searchedFor: req.query.q.toLowerCase()
          })
        }
      })
    }

  })

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ results }))
}