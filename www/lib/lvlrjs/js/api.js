"use strict";
(function() {
  var lvlrApi = (function() {
    var lvlrApi = function($http, $location, lvlrSession, ApiEndpoint) {
      var urlBase = ApiEndpoint.url + '/api/v1/'
      var estBase = ApiEndpoint.url + '/pres/'

      var checkSessionValidity = function(data, eb) {
        if (data.unauthorized) {
          lvlrSession.destroySession()
        }
        eb(data)
      }
      lvlrApi.prototype.endpoint = ApiEndpoint.url
      lvlrApi.prototype.isProxy = (ApiEndpoint.url.match(/localhost/) ? true : false)
      lvlrApi.prototype.getFullImageUrl = function(url) {
        if (!this.isProxy) {
          url = this.endpoint + url
        }
        return url
      }
      lvlrApi.prototype.doLogin = function(data, cb, eb) {
        $http.post(urlBase + 'login', data)
        .success(function(data) {
          // clean up the taxType null
          if (data.ok) {
            cb(data.data)
          } else eb(data)
        })
        .error(function(data) {
          eb(data)
        })
      }

      lvlrApi.prototype.checkSession = function(session, cb, eb) {
        $http.get(urlBase + 'session?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else eb(data)
        })
        .error(function(data) {
          eb(data)
        })
      }

      lvlrApi.prototype.sendHealth = function(slug, data, cb, eb) {
        $http.post('/api/_health/timing/'+slug, data)
        .success(function(data) {
          // clean up the taxType null
          if (data.ok) {
            cb(data.data)
          } else cb(data)
        })
        .error(function(data) {
          eb(data)
        })
      }

      lvlrApi.prototype.signup = function(data, cb, eb) {
        $http.post(urlBase + 'signup', data)
        .success(function(data) {
          if (data.ok) {
            cb(data.data)
          } else eb(data)
        })
        .error(function(data) {
          eb(data)
        })
      }

      lvlrApi.prototype.getCo = function(slug, cb, eb) {
        var url = urlBase + 'co/' + slug
        $http.get(url)
        .success(function(data) {
          // clean up the taxType null
          if (data.ok) {
            if (data.data.taxType === null) data.data.taxType = 'none'
            cb(data.data)
          } else cb(data)
        })
        .error(function(data) {
          eb(data)
        })
      }

      lvlrApi.prototype.getCoDetails = function(session, slug, cb, eb) {
        var url = urlBase + 'codetails/' + slug + '?session=' + session
        $http.get(url)
        .success(function(data) {
          // clean up the taxType null
          if (data.ok) {
            if (data.data.taxType === null) data.data.taxType = 'none'
            cb(data.data)
          } else cb(data)
        })
        .error(function(data) {
          eb(data)
        })
      }


      lvlrApi.prototype.getCoDisplay = function(session, slug, cb, eb) {
        $http.get(urlBase+'co/'+slug + '/display')
        .success(function(data) {
          if (data.ok) {
            cb(data.data)
          } else cb(data)
        })
        .error(function(data) {
          eb(data)
        })
      }

      lvlrApi.prototype.setCoDisplayKey = function(session, slug, key, data, cb, eb) {
        data.session = session
        $http.post(urlBase +'co/'+slug + '/display/' + key, data)
        .success(function(data) {
          if (data.ok) {
            cb(data.data)
          } else cb(data)
        })
        .error(function(data) {
          eb(data)
        })
      }

      lvlrApi.prototype.getRenderedEst = function(estid, cb, eb) {
        $http.get(estBase + estid+ '/est?dtp=1')
        .success(function(data) {
          cb(data)
        })
        .error(function(data) {
          eb(data)
        })
      }


      lvlrApi.prototype.getEstShares = function(session, estid, cb, eb) {
        $http.get(urlBase+'shares/est/'+ estid+ '?session=' + session)
        .success(function(data) {
          if (data.ok) { cb(data.data) }
          else {
            checkSessionValidity(data, eb)
          }
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getJobShares = function(session, jobid, cb, eb) {
        $http.get(urlBase+'shares/job/'+ jobid+ '?session=' + session)
        .success(function(data) {
          if (data.ok) { cb(data.data) }
          else {
            checkSessionValidity(data, eb)
          }
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }
      lvlrApi.prototype.updateJobStatus = function(session, jobid, status, cb, eb){
        var data = {
          'session': session
        }
        $http.post(urlBase + 'job/' + jobid + '/' + status, data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else {
            checkSessionValidity(data, eb)
          }
        })
        .error(function(error) {
          checkSessionValidity(data, eb)
        })
      }
      lvlrApi.prototype.getPicsForJob = function(session, jobid, cb, eb) {
        $http.get(urlBase+'job/'+ jobid+ '/pics?session=' + session)
        .success(function(data) {
          if (data.ok) { cb(data.data) }
          else { 
            checkSessionValidity(data, eb)
          }
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.setJobPic = function(session, jobid, jpid, data, cb, eb){
        data.session = session
        $http.post(urlBase + 'job/' + jobid + '/pic/' + jpid, data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else {
            checkSessionValidity(data, eb)
          }
        })
        .error(function(error) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.deleteJobPic = function(session, jobid, jpid, cb, eb) {
        $http.delete(urlBase + 'job/' + jobid + '/pic/' +jpid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else {
            checkSessionValidity(data, eb)
          }
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }


      lvlrApi.prototype.updateEstStatus = function(session, estid, status, cb, eb){
        var data = {
          'session': session
        }
        $http.post(urlBase + 'est/' + estid + '/' + status, data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else {
            checkSessionValidity(data, eb)
          }
        })
        .error(function(error) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getEstStyles = function(session, cb, eb) {
        $http.get(urlBase + 'est/styles?session=' + session)
        .success(function(data) {
          if (!data.ok) checkSessionValidity(data, eb)
          else cb(data.data)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.setEstStyle = function(session, estid, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'est/'+ estid +'/templ', data)
        .success(function(data) {
          if (!data.ok) checkSessionValidity(data, eb)
          else cb(data.data)
        })
        .error(function(data) {
          eb(data)
          checkSessionValidity(data, eb)
        })
      }


      lvlrApi.prototype.getEstQuick = function(session, estId, cb, eb) {
        $http.get(urlBase + 'est/' + estId + '?session=' + session)
        .success(function(data) {
          if (!data.ok) checkSessionValidity(data, eb)
          else cb(data.data)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }
      lvlrApi.prototype.markEstPending = function(session, estId, cb, eb) {
        var data = { 'session': session }
        $http.post(urlBase + 'est/' + estId + '/pending', data)
        .success(function(data) {
          if (!data.ok) checkSessionValidity(data, eb)
          else cb(data.data)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getEst = function(estId, cb, eb) {
        $http.get(urlBase + 'estblob/' + estId)
        .success(function(data) {
          if (!data.ok) eb(data)
          else cb(data.data)
        })
        .error(function(data) {
          eb(data)
        })
      }

      // Set or Create estimate. if new, pass in an 'estId' of 'new' to create.
      lvlrApi.prototype.setEst = function(session, estId, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'est/' + estId, data)
        .success(function(data) {
          if (!data.ok) checkSessionValidity(data, eb)
          else cb(data.data)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.deleteEst = function(session, estId, cb, eb) {
        $http.delete(urlBase + 'est/' + estId + '?session=' + session)
        .success(function(data) {
          if (!data.ok) checkSessionValidity(data, eb)
          else cb(data)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.setEstZone = function(session, estId, zid, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'est/' + estId + '/zone/' + zid, data)
        .success(function(data) {
          if (!data.ok) checkSessionValidity(data, eb)
          else cb(data)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.deleteEstZone = function(session, estId, zid, cb, eb) {
        $http.delete(urlBase + 'est/' + estId + '/zone/' + zid + '?session=' + session)
        .success(function(data) {
          if (!data.ok) checkSessionValidity(data, eb)
          else cb(data)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.setEstItem = function(session, estId, zid, eiid, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'est/' + estId + '/zone/' + zid + '/item/' + eiid, data)
        .success(function(data) {
          if (!data.ok) checkSessionValidity(data, eb)
          else cb(data.data)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.deleteEstItem = function(session, estId, zid, eiid, cb, eb) {
        $http.delete(urlBase + 'est/' + estId + '/zone/' + zid + '/item/' + eiid + '?session=' + session)
        .success(function(data) {
          if (data.ok) {
            cb(data)
          } else {
            checkSessionValidity(data, eb)
          }
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.setEstItemMod = function(session, estId, zid, eiid, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'est/' + estId + '/zone/' + zid + '/item/' + eiid + '/mod', data)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      // set multiple options at once
      lvlrApi.prototype.setEstItemMods = function(session, estId, zid, eiid, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'est/' + estId + '/zone/' + zid + '/item/' + eiid + '/mods', data)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.deleteEstItemMod = function(session, estId, zid, eiid, data, cb, eb) {
        data.session = session
        $http.delete(urlBase + 'est/' + estId + '/zone/' + zid + '/item/' + eiid + '/mod', data)
        .success(function(data) {
          if (data.ok) {
            cb(data)
          } else {
            checkSessionValidity(data, eb)
          }

        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getEstTaxes = function(session, estid, cb, eb) {
        $http.get(urlBase + 'est/' + estid + '/taxes?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.setEstTax = function(session, estid, tdid, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'est/' + estid + '/tax/' + tdid, data)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.deleteEstTax = function(session, estid, etid, cb, eb) {
        $http.delete(urlBase + 'est/' + estid + '/tax/' + etid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.setEstDiscount = function(session, estid, did, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'est/' + estid + '/disc/' + did, data)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getEstDiscounts = function(session, estid, cb, eb) {
        $http.get(urlBase + 'est/' + estid + '/discs?session='+ session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.deleteEstDisc = function(session, estid, edid, cb, eb) {
        $http.delete(urlBase + 'est/' + estid + '/disc/' + edid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      // admin stuff
      lvlrApi.prototype.setLake = function(tag, data, cb, eb) {
        var obj = {}
        obj.body = data
        obj.tag = tag
        return $http.post(urlBase + 'datalake', obj)
          .success(function(data) {
            if (data.ok) cb(data)
            else eb(data)
          })
          .error(function(error) {
            eb(data)
          })
      }

      lvlrApi.prototype.getLake = function(session, tagname, cb, eb) {
        $http.get(urlBase + 'uber/datalake/' + tagname + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.createEye = function(sid, token, cb, eb){
        $http.get(urlBase + 'eyes/' + sid  + '/' + token)
        .success(function(data) {
          cb(data)
        })
        .error(function(data) {
          eb(data)
        })
      }

      lvlrApi.prototype.uberGetRawDoc = function(session, docid, cb, eb) {
        $http.get(urlBase + 'uber/rawdoc/' + docid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(error) {
          checkSessionValidity(error, eb)
        })
      }

      lvlrApi.prototype.uberSetRawDoc = function(session, docid, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'uber/rawdoc/' + docid, data)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(error) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.uberGetCoStates = function(session, coid, cb, eb) {
        $http.get(urlBase + 'uber/costates/'+ coid +'?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(error) {
          checkSessionValidity(error, eb)
        })
      }

      // get all the users!
      lvlrApi.prototype.uberGetUsers = function(session, skip, cb, eb) {
        $http.get(urlBase + 'uber/users?session=' + session + '&pg_sk=' + skip)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(error) {
          checkSessionValidity(error, eb)
        })
      }

      lvlrApi.prototype.uberGetCoList = function(session, skip, cb, eb) {
        $http.get(urlBase + 'uber/colist?session=' + session + '&pg_sk='+ skip)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(error) {
          checkSessionValidity(error, eb)
        })
      }

      lvlrApi.prototype.uberMimic = function(session, uid, cb, eb) {
        var data = {
          'session': session
        }
        $http.post(urlBase + 'uber/mimic/' + uid, data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(error) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.uberPass = function(session, uid, password, cb, eb) {
        var data = {
          'session': session,
          'password': password
        }
        $http.post(urlBase + 'uber/userpass/' + uid, data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(error) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getTimeline = function(session, cb, eb) {
        $http.get(urlBase + 'timeline_for_co?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getJobTimeline = function(session, jobid, cb, eb) {
        $http.get(urlBase + 'timeline_for_job/' + jobid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }


      lvlrApi.prototype.getJobs = function(session, skip, limit, cb, eb) {
        $http.get(urlBase + 'jobs?session=' + session + '&pg_sk=' + skip + '&pg_lm=' + limit)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getJobsForClient = function(session, clid, cb, eb) {
        $http.get(urlBase + 'client/'+ clid + '/jobs?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getJob = function(session, jobid, cb, eb) {
        $http.get(urlBase + 'job/' + jobid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.setJob = function(session, jobid, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'job/' + jobid, data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.delJob = function(session, jobid, cb, eb) {
        $http.delete(urlBase + 'job/' + jobid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.uberGetCoUsers = function(session, coid, cb, eb) {
        $http.get(urlBase + 'uber/cousers/' + coid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(error) {
          checkSessionValidity(error, eb)
        })
      }

      lvlrApi.prototype.getGallery = function(session, slug, cb, eb) {
        $http.get(urlBase+'co/'+ slug + '/gallery?session=' + session)
        .success(function(data) {
          if (data.ok) { cb(data.data) }
          else {
            checkSessionValidity(data, eb)
          }
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.setGalleryPic = function(session, slug, gpid, data, cb, eb){
        data.session = session
        $http.post(urlBase + 'co/' + slug + '/gallery/' + gpid, data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else {
            checkSessionValidity(data, eb)
          }
        })
        .error(function(error) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.deleteGalleryPic = function(session, slug, gpid, cb, eb) {
        $http.delete(urlBase + 'co/' + slug + '/gallery/' +gpid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data)
          else {
            checkSessionValidity(data, eb)
          }
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.updateCo = function(session, slug, data, cb, eb) {
        data.session = session
        return $http.post(urlBase+'co/'+slug, data)
          .success(function(data) {
            if (data.ok) cb(data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data) {
            checkSessionValidity(data, eb)
          })
      }

     lvlrApi.prototype.getUserState = function(session, cb, eb) {
        var urlobj = {
          'headers': {
            'Content-Type': 'application/json'
          },
          'method': 'GET',
          'url': urlBase + 'userstate?session=' + session,
        }
        $http(urlobj)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }


     lvlrApi.prototype.getCoState = function(session, cb, eb) {
        var urlobj = {
          'headers': {
            'Content-Type': 'application/json'
          },
          'method': 'GET',
          'url': urlBase + 'costate?session=' + session,
        }
        $http(urlobj)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

     lvlrApi.prototype.getCoStateKey = function(session, key,cb, eb) {
        $http.get(urlBase + 'costate/' + key + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

     lvlrApi.prototype.setCoStateKey = function(session, key, coStateObj, cb, eb) {
        coStateObj.session = session
        $http.post(urlBase + 'costate/' + key, coStateObj)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

     lvlrApi.prototype.getUserStateKey = function(session, key,cb, eb) {
        $http.get(urlBase + 'userstate/' + key + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

     lvlrApi.prototype.setUserStateKey = function(session, key, coStateObj, cb, eb) {
        coStateObj.session = session
        $http.post(urlBase + 'userstate/' + key, coStateObj)
        .success(function(data) {
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getDiscountDef = function(session, did, cb, eb) {
        // optionally pass in  tid to get a specific id.
        var discurl = did ? urlBase + 'discdefn/' + did : urlBase + 'discdefns'
        $http.get(discurl + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }


      lvlrApi.prototype.setDiscountDef = function(session, discdata, did, cb, eb) {
        discdata.session = session
        var discurl = did ? urlBase + 'discdefn/' + did : urlBase + 'discdefn'
        return $http.post(discurl, discdata)
          .success(function(data) {
            if (data.ok) cb(data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data, status) {
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.delDiscountDef = function(session, did, cb, eb) {
        $http.delete(urlBase + 'discdefn/' +  did + '?session=' + session)
        .success(function(data) {
          // clean up the taxType null
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }


      lvlrApi.prototype.getTaxDef = function(session, tid, cb) {
        // optionally pass in  tid to get a specific id.
        var taxurl = tid ? urlBase + 'taxdefn/' + tid : urlBase + 'taxdefns'
        $http.get(taxurl + '?session=' + session)
        .success(function(data) {
          // clean up the taxType null
          if (data.ok) {
            if (data.data.taxType === null) data.data.taxType = 'none'
            cb(data.data)
          } else cb(data)
        })
      }

      lvlrApi.prototype.delTaxDef = function(session, tid, cb, eb) {
        $http.delete(urlBase + 'taxdefn/' +  tid + '?session=' + session)
        .success(function(data) {
          // clean up the taxType null
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.setTaxDef = function(session, data, tid, cb, eb) {
        data.session = session
        var taxurl = tid ? urlBase + 'taxdefn/' + tid : urlBase + 'taxdefn'
        return $http.post(taxurl, data)
          .success(function(data) { 
            if (data.ok) cb(data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data) {
            checkSessionValidity(data, eb)
          })
      }


      // Factories for getting and setting certain objects state
      lvlrApi.prototype.getObjState = function(session, endpoint, cb, eb) {
        $http.get(urlBase + endpoint)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getCatalogList = function(session, folder, cb, eb) {
        var url = urlBase + 'catalog'
        if (folder) {
          url = url + '/' + folder
        }
        $http.get(url + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getCatalogFolders = function(session, cb, eb) {
        var url = urlBase + 'catgfolders'
        $http.get(url + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getCatalogItem = function(session, cid, cb, eb) {
        $http.get(urlBase + 'catgitem/' + cid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.delCatalogItem = function(session, cid, cb, eb) {
        $http.delete(urlBase + 'catgitem/' + cid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }


      lvlrApi.prototype.createCatalogItem = function(session, data, cb, eb) {
        data.session = session
        $http.post(urlBase + 'catgitem', data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.updateCatalogItem = function(session, data, cid, cb, eb) {
        data.session = session
        $http.post(urlBase + 'catgitem/' + cid, data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.addCatalogItemOption = function(session, data, cid, cb, eb) {
        data.session = session
        $http.post(urlBase + 'catgitem/' + cid + '/addopt', data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }


      // DELETE ALL THE OPTIONS
      lvlrApi.prototype.deleteCatalogItemOptions = function(session, data, cid, cb, eb) {
        data.session = session
        $http.post(urlBase + 'catgitem/' + cid + '/delopts', data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }


      lvlrApi.prototype.deleteCatalogItemOption = function(session, data, cid, idx, cb, eb) {
        data.session = session
        $http.post(urlBase + 'catgitem/' + cid + '/delopt/' + idx, data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getSession = function(session_id, cb, eb) {
        $http.get(urlBase + 'session?session='+ session_id)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data) {
          checkSessionValidity(data, eb)
        })
      }
      lvlrApi.prototype.resendVerification = function(email, cb, eb) {
        var data = {
          'email': email
        }
        return $http.post(urlBase + 'resend_verify' , data)
          .success(function(data) {
            if (data.ok) cb(data)
            else eb(data)
          })
          .error(function(data, status) {
            eb(data)
          })
      }

      lvlrApi.prototype.resetPwd = function(email, cb, eb) {
        var obj = {
          email: email
        }
        return $http.post(urlBase + 'resetpass' , obj)
          .success(function(data) {
            if (data.ok) cb(data)
            else eb(data)
          })
          .error(function(data, status) {
            eb(data)
          })
      }
      lvlrApi.prototype.changePwd = function(session, password, cb, eb) {
        var obj = {
          password: password
        }
        obj.session = session
        return $http.post(urlBase + 'changepassword' , obj)
          .success(function(data) {
            if (data.ok) cb(data)
            else eb(data)
          })
          .error(function(data, status) {
            eb(data)
          })
      }


      // Checking tokens... makin money.
      lvlrApi.prototype.checkToken = function(token, uid, cb, eb) {
        var obj = {
          uid: uid,
          token: token,
        }
        return $http.post(urlBase + 'verifytoken' , obj)
          .success(function(data) {
            if (data.ok) cb(data)
            else eb(data)
          })
          .error(function(data, status) {
            eb(data)
          })
      }

      // Factories for getting and setting certain objects state
      lvlrApi.prototype.updateObjState = function(session, endpoint, keyname, client, cb, eb) {
        client.session = session
        return $http.post(urlBase + endpoint + '/' + keyname, client)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data, status) {
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.updateClient = function(session, clid, client, cb, eb) {
        client.session = session
        return $http.post(urlBase+'client/' + clid , client)
          .success(function(data) {
            if (data.ok) cb(data.data.clid)
            else checkSessionValidity(data, eb)
          })
          .error(function(data, status) {
            checkSessionValidity(data, eb)
          })
      }


      lvlrApi.prototype.createClient = function(session, client, cb, eb) {
        client.session = session
        return $http.post(urlBase+'client', client)
          .success(function(data) {
            if (data.ok) cb(data.data.clid)
            else checkSessionValidity(data, eb)
          })
          .error(function(data, status) {
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.updateClient = function(session, clid, client, cb, eb) {
        client.session = session
        return $http.post(urlBase+'client/' + clid, client)
          .success(function(data) {
            if (data.ok) cb(data.data.clid)
            else checkSessionValidity(data, eb)
          })
          .error(function(data, status) {
            checkSessionValidity(data, eb)
          })
      }


      lvlrApi.prototype.getClient = function(session, clid, cb, eb) {
        $http.get(urlBase+'client/' + clid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data, status) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.delClient = function(session, clid, cb, eb) {
        $http.delete(urlBase+'client/' + clid + '?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data, status) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getClients = function(session, cb, eb) {
        $http.get(urlBase+'clients?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data, status) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.getUsers = function(session, cb, eb) {
        $http.get(urlBase+'users?session=' + session)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data, status) {
          checkSessionValidity(data, eb)
        })
      }

      // get a single user
      lvlrApi.prototype.getUser = function(userid, cb, eb) {
        $http.get(urlBase+'user/' + userid)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data, status) {
          checkSessionValidity(data, eb)
        })
      }
      // update a user
      lvlrApi.prototype.editUser = function(session, userid, data, cb, eb) {
        data.session = session
        $http.post(urlBase+'admin/user/' + userid, data)
        .success(function(data) {
          if (data.ok) cb(data.data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data, status) {
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.deleteUser = function(session, userid, cb, eb) {
        $http.delete(urlBase+'user/' + userid + '?session=' + session)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data, status) {
            checkSessionValidity(data, eb)
          })
      }
      lvlrApi.prototype.addUser = function(session, user, cb, eb) {
        user.session = session // attach our session key
        return $http.post(urlBase+'newuser', user)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data, status) {
            checkSessionValidity(data, eb)
          })
      }
      lvlrApi.prototype.updateProfile = function(session, user, cb, eb) {
        /* Used to update current user profile.
        */
        user.session = session
        return $http.post(urlBase + 'myself', user)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data, status) {
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.uploadPic = function(session, imageData, cb, eb) {
        var data = {
          pic: imageData,
          session: session
        }
        $http.post(urlBase+'pic', data, { } )
        .success(function(data){
          if (data.ok) cb(data)
          else checkSessionValidity(data, eb)
        })
        .error(function(data){
          checkSessionValidity(data, eb)
        })
      }

      lvlrApi.prototype.emailEst = function(session, data, estid, cb, eb) {
        data.session = session
        return $http.post(urlBase + 'email/est/' + estid, data)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data, status) {
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.getWorknotes = function(session, jobid, cb, eb) {
        return $http.get(urlBase + 'worknotes_for_job/' + jobid + '?session=' + session)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data){
            checkSessionValidity(data, eb)
          })
      }
      lvlrApi.prototype.getWorknote = function(session, wnid, cb, eb) {
        return $http.get(urlBase + 'worknote/' + wnid + '?session=' + session)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data){
            checkSessionValidity(data, eb)
          })
      }
      lvlrApi.prototype.setWorknote = function(session, wnid, data, cb, eb) {
        data.session = session
        return $http.post(urlBase + 'worknote/' + wnid, data)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data){
            checkSessionValidity(data, eb)
          })
      }
      lvlrApi.prototype.deleteWorknote = function(session, wnid, cb, eb) {
        return $http.delete(urlBase + 'worknote/' + wnid + '?session=' + session)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data){
            checkSessionValidity(data, eb)
          })
      }
      // billing api
      lvlrApi.prototype.getBilling = function(session, cb, eb) {
        return $http.get(urlBase + 'billing?session=' + session)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data){
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.getBillingHistory = function(session, cb, eb) {
        return $http.get(urlBase + 'billing/history?session=' + session)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data){
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.getCard = function(session, cb, eb) {
        return $http.get(urlBase + 'billing/card?session=' + session)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data){
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.updateCard = function(session, data, cb, eb) {
        data.session = session
        return $http.post(urlBase + 'billing/card', data)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data){
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.setUsers = function(session, data, cb, eb) {
        data.session = session
        return $http.post(urlBase + 'billing/users', data)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data){
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.updatePlan = function(session, data, cb, eb) {
        data.session = session
        return $http.post(urlBase + 'billing/plan', data)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else checkSessionValidity(data, eb)
          })
          .error(function(data){
            checkSessionValidity(data, eb)
          })
      }

      lvlrApi.prototype.signClient = function(estid, imagedata, signame, cb, eb) {
        var data = {
          'signer_name': signame,
          'sigdata': imagedata
        }
        return $http.post(urlBase + 'est/' + estid + '/sign/client', data)
          .success(function(data) {
            if (data.ok) cb(data.data)
            else eb(data)
          })
          .error(function(error){
            eb(error)
          })
      }

    }

    return lvlrApi
  })();
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = lvlrApi;
  else
    window.lvlrApi = lvlrApi;
})()
