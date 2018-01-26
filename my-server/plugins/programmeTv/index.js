'use strict';

import Plugin from '../../models/Plugin.js';
import request from 'request';
import cheerio from 'cheerio';
import fs from 'fs';
import EventEmitter from 'events';
import channelDictionnary from './channels.json';

class ProgrammeTvPlugin extends Plugin {

    constructor(path) {
        super(path);
        this.programmes = [];
    }

    doRequest(id, data) {
        let now = new Date();
        this.filePath = __dirname + '/history/programme-' + now.getDate() + (now.getMonth() + 1) + now.getFullYear() + '.json';
        console.log("Request: " + id);
        switch (id) {
            case "programme":
                let response = "Voici la liste des programmes";
                this.getProgrammeHistory();
                return response;
        }
        return null;
    }

    getProgrammeHistory() {

        if (fs.existsSync(this.filePath)) {
            fs.readFile(this.filePath, (err, data) => {
                if (err) throw err;
                // console.log("file data", data.toString());
                let returnData = {
                    channels: channelDictionnary,
                    programme: JSON.parse(data.toString())
                }
                this.service.emitEvent('programme-done', JSON.stringify(returnData));
                return data;
            });
        } else {
            return this.fetchProgramme();
        }

    }

    fetchProgramme() {
        console.log("fetching programme");
        let programme = [];
        request('https://webnext.fr/programme-tv-rss', (error, response, body) => {
            let $ = cheerio.load(body);
            let rssLink = 'https://webnext.fr/' + $("a[title='programme TV du jour au format RSS']").attr("href");
            // console.log('rssLink', rssLink);
            request(rssLink, (error, response, body) => {
                // console.log('body rss', body);
                let jq = cheerio.load(body, { xmlMode: true });
                programme = this.fillProgramme(jq);
                this.saveProgramme(programme);
                let returnData = {
                    channels: channelDictionnary,
                    programme: programme
                }
                this.service.emitEvent('programme-done', JSON.stringify(returnData));
            });
        });
    }

    saveProgramme(programme) {
        fs.writeFileSync(this.filePath, JSON.stringify(programme), function(err) {
            if (err) {
                console.error('error : ', err);
            }
        });
    }

    fillProgramme(jq) {
        let tmpProgramme = [];
        jq('channel item').each(function(index, item) {
            let itemData = jq(item).find('title').text().split('|');
            let itemProgramme = {
                channel: itemData[0].trim(),
                time: itemData[1],
                title: itemData[2],
                link: jq(item).find('link').text(),
                category: jq(item).find('category').text(),
                description: jq(item).find('description').text()
            }
            tmpProgramme.push(itemProgramme);
        });
        return tmpProgramme;
    }
}

export default new ProgrammeTvPlugin(__dirname);