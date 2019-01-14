import Immutable from '../libs/immutable.min.js'
import { wxPromise } from '../utils/request';
import log from '../utils/logger';
import { Observable, interval, Subject, AsyncSubject, BehaviorSubject, from } from '../libs/rxjs.umd';
import {
  APP_NAME,
  APP_VERSION,
  APP_ID
} from "../project.constants.js";

const singleton = Symbol();
const singletonEnforcer = Symbol();

const INITIAL_STATE = {
  app: {
    appName: APP_NAME,
    appVersion: APP_VERSION,
    appId: APP_ID
  }
};

class AppStore {

  constructor(enforcer) {
    log("-------------------------------------------Latest Log--------------------------------------------------------");
    if (enforcer != singletonEnforcer) throw "Cannot construct singleton";
    this.state = Immutable.Map(INITIAL_STATE);
    this.global_subject = null;
    this.global_observer = null;
     // set the global state observerable object
     this.global_subject = new BehaviorSubject(this.state);
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new AppStore(singletonEnforcer);
    }
    return this[singleton];
  }

  init() {
     this.global_subject.subscribe({ // optional
       next: (state) => {
         log('App Store State Update Log:', state.toJSON());
       }
     });
  }

  bind(stateKeysArray) {
    this.contextStateKeysArray = stateKeysArray;
    return this;
  }

  unbind() {
    this.contextStateKeysArray = null;
    return this;
  }

  getState () {
    return this.state.toJSON();
  }

  getInState(...args) {
    return this.state.getIn(...args).toJSON();
  }

  updateInState(...args) {
    this.state = this.state.updateIn(...args);
    this.global_subject.next(this.state);
  }

  connect(context) {
    let self = this;
    this.global_observer = this.global_subject.subscribe({
      next: () => {
        self._updatePageData(context)
      }
    });
    return this;
  }

  disconnect() {
    this.global_observer.unsubscribe();
    this.unbind();
  }

  // Apply the current state to MP page data
  _updatePageData(context) {
    const state = this.state.toJSON();
    if (context) {
      if (this.contextStateKeysArray) {
        let obj = {};
        this.contextStateKeysArray.map((csk) => {
          if (state[csk]) {
            obj[csk] = state[csk];
          }
        });
        context.setData(obj)
      } else {
        context.setData({
          state: state
        })
      }
    } else {
      console.log('No MP page attached!');
    }
  }

  // update the state
  update(data) {
    let obj = Immutable.Map(data);
    this.state = this.state.merge(obj);
    this.global_subject.next(this.state);
  }
}

export default AppStore