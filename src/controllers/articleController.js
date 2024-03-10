/*
--------------------------
Retrieve one article from 
the database.
--------------------------
*/
async function getOneArticle(req, res, next) {
  return res.send("One article");
}

/*
--------------------------
Retrieve all articles from 
the database.
--------------------------
*/
async function getAllArticles(req, res, next) {
  return res.send("All articles");
}

/*
--------------------------
Create and save a new article
in the database
--------------------------
*/
async function createArticle(req, res, next) {
  return res.send("Article is created");
}

/*
--------------------------
Update article by the id 
in the request
--------------------------
*/
async function updateArticle(req, res, next) {
  return res.send("Article is updated");
}

/*
--------------------------
Delete article with 
the specified id 
in the request
--------------------------
*/
async function deleteArticle(req, res, next) {
  return res.send("Article is deleted");
}

/*
--------------------------
Delete all articles from 
the database.
--------------------------
*/
async function deleteAllArticles(req, res, next) {
  return res.send("Articles are deleted");
}

export {
  createArticle,
  deleteAllArticles,
  deleteArticle,
  getAllArticles,
  getOneArticle,
  updateArticle,
};

export default {
  createArticle,
  deleteAllArticles,
  deleteArticle,
  getAllArticles,
  getOneArticle,
  updateArticle,
};
