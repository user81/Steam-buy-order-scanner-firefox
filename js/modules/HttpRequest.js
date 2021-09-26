/**
 *  Steam buy order scanner - is browser extension which to keep your Steam buy Market orders profitable.
 *  https://github.com/user81/Steam-buy-order-scanner-firefox
 *  Copyright (C) 2021 Ermachenya Aleksandr
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * скрипт который обращается к серверу и возвращает его ответ в виде строки
 * 
 * @param {string} url ссылка для запросов к серверу
 * @param {number} attempts количество повторений
 * @param {number} scanIntervalSET пауза между запросами (милисекунды)
 * @param {number} errorPauseSET пауза между ошибками (минуты)
 * @returns 
 */
globalThis.httpErrorPause = async function(url, attempts = 8, scanIntervalSET = 6000, errorPauseSET = 5) {
    let httpGetRequest = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(this.response);
            } else {
                var httpError = new Error(this.statusText);
                httpError.code = this.status;
                reject(httpError);
            }
        };
        xhr.onerror = function () {
            reject(new Error("Network Error"));
        };
        xhr.send();
    });

    return await httpGetRequest.catch(async function () {
        if (attempts <= 0) {
            await waitTime( (+errorPauseSET  + Math.floor(Math.random() * 5)) * 60000);
            return httpErrorPause(url, attempts = 8);
        }
        await waitTime( 5000 + scanIntervalSET + Math.floor(Math.random() * 50));
        return httpErrorPause(url, attempts - 1);
    });
};

async function waitTime(ms) { return new Promise(resolve => setTimeout(resolve,ms)); }


