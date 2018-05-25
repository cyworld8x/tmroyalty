import populate from './dataGenerator'
import users from './raw/users'
import user from './raw/user'
import articles from './raw/articles'
import news from './raw/news'
import notifications from './raw/notifications'
import conversations from './raw/conversations'
import cards from './raw/cards'
import _ from 'lodash'

class DataProvider {

  getUser(id = 1) {
    return _.find(users, x => x.id == id);
  }

  getUsers() {
    return users;
  }

  getNotifications() {
    return notifications;
  }

  getArticles(type = 'article') {
    return _.filter(articles, x => x.type == type);
  }

  getArticle(id) {
    return _.find(articles, x => x.id == id);
  }

  getnews(type = '') {
    return _.filter(news, x => x.type == type);
  }

  getConversation(userId = 1) {
    return _.find(conversations, x => x.withUser.id == userId);
  }

  getChatList() {
    return conversations;
  }

  getComments(postId = 1) {
    return this.getArticle(postId).comments;
  }

  getCards() {
    return cards;
  }

  populateData() {
    populate();
  }

  getUser(){
    return user;
  }
}

export let data = new DataProvider();