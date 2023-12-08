const router = require('express').Router()

const Chapter = require('../controller/chapterController')

router.get('/', Chapter.findAllChapter)
router.post('/create/:id', Chapter.createChapter) //create course dengan mengambil id course
router.get('/:id', Chapter.findChapter)
router.patch('/update/:id', Chapter.updateChapter)
router.delete('/delete/:id', Chapter.deleteChapter)

module.exports = router
