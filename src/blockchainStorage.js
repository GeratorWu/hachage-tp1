import {readFile, writeFile} from 'node:fs/promises'
import {getDate, monSecret} from "./divers.js";
import {NotFoundError} from "./errors.js";
import {createHash} from 'node:crypto'
import {v4 as uuidv4} from 'uuid';


/* Chemin de stockage des blocks */
const path = '../data/blockchain.json'

/**
 * Mes définitions
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 *
 */

/**
 * Renvoie un tableau json de tous les blocks
 * @return {Promise<any>}
 */
export async function findBlocks() {
    try{
        const filePath = new URL(path, import.meta.url);
        const contents = await readFile(filePath, {encoding: 'utf8'});
        return JSON.parse(contents)
    }
    catch (e) {
        console.error("Erreur lors de la lecture :", e);
        return [];
    }
}


/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    // A coder
}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    let tmp = await findBlocks();
    let res;
    if(tmp.length > 0){
        res = tmp[tmp.length-1];
    }
    else{
        res = null;
    }
    return res;
}

/**
 * Creation d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(contenu) {
    const dernierBlock = await findLastBlock();
    const hash = createHash('sha256').update(JSON.stringify(dernierBlock)).digest('hex');

    const block = {
        "id": uuidv4(),
        "nom":contenu.nom,
        "don":contenu.don,
        "date": getDate(),
        "previousBlockHash": dernierBlock ? hash : null
    }
    const res = await findBlocks();
    res.push(block);
    console.log(res);

    try{
        const filePath = new URL(path, import.meta.url);
        await writeFile(filePath, JSON.stringify(res), 'utf-8');
        return res;
    }
    catch (error) {
        console.error("erreur lors de l'écriture du fichier :", error);
    }
}
