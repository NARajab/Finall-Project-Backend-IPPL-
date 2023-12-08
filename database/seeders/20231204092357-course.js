'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const courses = [
      {
        userId: 1,
        courseCode: 'UIUX1',
        courseName: 'Binar Beginner UI/UX',
        courseType: 'Free',
        courseLevel: 'Beginner',
        description:
          'Belajar dasar-dasar desain antarmuka pengguna (UI) dan pengalaman pengguna (UX) dengan kursus "Binar Beginner UI/UX". Kursus ini dirancang khusus untuk pemula yang ingin memahami konsep dasar desain UI/UX dan membangun dasar yang kuat dalam menciptakan pengalaman pengguna yang menarik dan efektif.',
        objectiveCourse:
          'Mengajarkan dasar-dasar desain antarmuka pengguna (UI) dan pengalaman pengguna (UX) serta konsep-konsep design system. Memberikan keterampilan menggunakan alat desain seperti Figma dan menerapkan prinsip-prinsip desain UI yang efektif. Peserta akan dapat menciptakan pengalaman pengguna yang menarik dan membangun dasar kuat untuk karir di bidang desain UI/UX melalui proyek-proyek praktis.',
        aboutCourse: 'Belajar UI/UX dasar',
        intendedFor: 'Untuk seorang pemula yang ingin menjadi Profesional',
        coursePrice: 0,
        categoryId: 1,
        rating: 4.7,
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735373080._AHX82eu7S.jpeg?updatedAt=1701735376494',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseCode: 'WD1',
        userId: 1,
        courseName: 'CSS dan HTML dalam seminggu',
        courseType: 'Free',
        courseLevel: 'Beginner',
        description:
          'Kursus "CSS dan HTML dalam Seminggu" adalah perjalanan intensif yang membawa Anda melalui dasar-dasar HTML dan CSS dalam waktu singkat. Melalui serangkaian modul yang terstruktur, Anda akan memahami struktur dan styling dasar halaman web. Kursus ini dirancang untuk pemula yang ingin mempercepat pemahaman mereka tentang HTML untuk struktur konten dan CSS untuk desain. Dengan fokus pada proyek-praktis, Anda akan langsung mengaplikasikan pengetahuan Anda dan membangun kepercayaan untuk membuat halaman web sederhana.',
        objectiveCourse:
          'Kelas "CSS dan HTML dalam Seminggu" bertujuan memberikan pemahaman yang cepat dan kuat tentang dasar-dasar HTML dan CSS. Melalui pendekatan intensif, Anda akan menguasai struktur dan styling dasar untuk membuat halaman web sederhana. Dengan fokus pada penerapan langsung melalui proyek-praktis, kursus ini dirancang untuk mempercepat kepercayaan diri Anda dalam menggunakan HTML untuk struktur dan CSS untuk desain. Tujuan utamanya adalah memberikan fondasi yang kokoh, memungkinkan Anda membuat dan mengelola halaman web dengan efektif dalam waktu singkat.',
        aboutCourse: 'Belajar Frontend Web menggunakan CSS dan HTML',
        intendedFor: 'Untuk seorang pemula yang ingin menjadi Profesional',
        categoryId: 2,
        coursePrice: 0,
        rating: 4.9,
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735496898._zmBLMJx9E.jpeg?updatedAt=1701735500597',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseCode: 'DS1',
        userId: 1,
        courseName: 'Belajar OOP Python',
        courseType: 'Free',
        courseLevel: 'Intermediate',
        description:
          'Kelas "Belajar OOP Python merupakan panduan intensif yang mengajak peserta memahami dan menguasai Pemrograman Berorientasi Objek (OOP) menggunakan bahasa pemrograman Python. Melalui materi yang disajikan secara sistematis, peserta akan diperkenalkan pada konsep dasar OOP, seperti kelas, objek, enkapsulasi, pewarisan, dan polimorfisme. Setiap topik disajikan dengan contoh praktis untuk memastikan pemahaman yang mendalam. Dengan kombinasi teori dan praktikum, kelas ini menjadi langkah awal yang ideal bagi siapa saja yang ingin menguasai OOP menggunakan Python.',
        objectiveCourse:
          'Kelas "Belajar OOP Python" dirancang untuk memberikan pemahaman komprehensif tentang Pemrograman Berorientasi Objek (OOP) menggunakan bahasa pemrograman Python. Dengan fokus pada konsep dasar OOP, peserta kelas akan mempelajari cara mengorganisir dan memahami kode secara objek, menciptakan kelas dan objek, serta menerapkan pewarisan, enkapsulasi, dan polimorfisme. Dengan tujuan memudahkan pemahaman dan penerapan konsep OOP, kelas ini memberikan fondasi yang kokoh bagi pengembang Python untuk meningkatkan keahlian pemrograman mereka.',
        aboutCourse: 'Belajar OOP Python',
        intendedFor:
          'Untuk seorang yang sudah familiar dengan python yang ingin menjadi lebih Profesional',
        coursePrice: 0,
        categoryId: 3,
        rating: 4.3,
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735530599._SaDVh2c2g.jpeg?updatedAt=1701735533852',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseCode: 'AD1',
        userId: 1,
        courseName: 'Belajar Kotlin Lanjutan',
        courseType: 'Premium',
        courseLevel: 'Advanced',
        description:
          'Belajar Kotlin Lanjutan adalah kelas yang dirancang khusus bagi mereka yang telah memiliki pemahaman dasar tentang bahasa pemrograman Kotlin dan ingin mengambil langkah lebih jauh. Dalam kelas ini, peserta akan dihadapkan pada konsep-konsep tingkat lanjut seperti generic, extension functions, coroutines, dan fitur-fitur canggih lainnya yang membuat Kotlin menjadi bahasa yang powerful dan ekspresif.',
        objectiveCourse:
          'Kelas ini bertujuan untuk memberikan pemahaman mendalam tentang fitur-fitur lanjut Kotlin, memungkinkan peserta mengoptimalkan penggunaan bahasa tersebut dalam pengembangan aplikasi yang kompleks. Peserta akan belajar menerapkan generic secara efektif, memahami penggunaan extension functions, mengelola proses asynchronous dengan coroutines, dan mengoptimalkan performa kode Kotlin untuk aplikasi yang lebih efisien.',
        aboutCourse: 'Belajar materi kotlin lanjutan',
        intendedFor: 'Android developer Profesional',
        coursePrice: 199000,
        categoryId: 4,
        rating: 4.2,
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735564320._8NY5we_7t.jpeg?updatedAt=1701735567581',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseCode: 'PM1',
        userId: 1,
        courseName: 'Mastery Product Management',
        courseType: 'Premium',
        courseLevel: 'Advanced',
        description:
          'Mastery Product Management adalah kursus khusus yang dirancang bagi mereka yang sudah memiliki pemahaman dasar tentang manajemen produk dan ingin meningkatkan keterampilan mereka. Dalam kursus ini, peserta akan mendalami konsep-konsep tingkat lanjut seperti analisis pasar, perencanaan strategis, dan pengembangan produk yang adaptif. Kurikulum mencakup studi komprehensif tentang manajemen siklus hidup produk dan pertimbangan etika dalam ranah manajemen produk.',
        objectiveCourse:
          'Kursus ini bertujuan memberikan pemahaman mendalam tentang fitur-fitur manajemen produk tingkat lanjut, memberdayakan peserta untuk mengoptimalkan penggunaan prinsip-prinsip manajemen produk dalam pengembangan aplikasi yang kompleks. Peserta akan belajar melakukan riset pengguna yang mendalam, mengembangkan dan melaksanakan strategi pemasaran yang efektif, menganalisis kinerja produk, dan mengatasi tantangan dalam lanskap dinamis manajemen produk.',
        aboutCourse: 'Menelusuri rumitnya manajemen produk tingkat lanjut',
        intendedFor: 'Dirancang khusus untuk manajer produk berpengalaman',
        coursePrice: 200000,
        categoryId: 5,
        rating: 4.1,
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735786642._-fTpdTNwR.jpeg?updatedAt=1701735789863',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseCode: 'ID1',
        userId: 1,
        courseName: 'Intermediate iOS Development',
        courseType: 'Premium',
        courseLevel: 'Intermediate',
        description:
          'Intermediate iOS Development adalah kursus yang cocok untuk pengembang iOS dengan pemahaman dasar dan ingin meningkatkan keterampilan mereka ke tingkat yang lebih tinggi. Dalam kursus ini, peserta akan menjelajahi konsep-konsep menengah dalam pengembangan aplikasi iOS, termasuk pengelolaan data, UI/UX design, dan pengoptimalan kinerja aplikasi.',
        objectiveCourse:
          'Kursus ini bertujuan memberikan peserta pemahaman yang kuat tentang konsep-konsep menengah dalam pengembangan aplikasi iOS. Peserta akan menguasai pengelolaan data yang efektif, meningkatkan desain antarmuka pengguna, dan mengoptimalkan kinerja aplikasi untuk memberikan pengalaman pengguna yang superior.',
        aboutCourse: 'Konsep menengah dalam pengembangan aplikasi iOS',
        intendedFor: 'Pengembang iOS',
        coursePrice: 200000,
        categoryId: 6,
        rating: 4.6,
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735786642._-fTpdTNwR.jpeg?updatedAt=1701735789863',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
    ]

    const chapter = [
      {
        courseId: 1,
        chapterTitle: 'Pendahuluan',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 1,
        chapterTitle: 'Memulai Desain',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 1,
        chapterTitle: 'Belajar Figma',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 2,
        chapterTitle: 'Pendahuluan HTML',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 2,
        chapterTitle: 'Styling HTML dengan CSS',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 3,
        chapterTitle: 'Pengenalan Class',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 3,
        chapterTitle: 'Pengenalan Module',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 4,
        chapterTitle: 'Mengenal Coroutine Scope',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 4,
        chapterTitle: 'Suspend Functions',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 4,
        chapterTitle: 'Async-Await Pattern',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 5,
        chapterTitle: 'Apa itu Manajemen Produk?',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 5,
        chapterTitle: 'Proses Pengembangan Produk',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 5,
        chapterTitle: 'Strategi Produk yang Sukses',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 5,
        chapterTitle: 'Metrik Produk yang Penting',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 6,
        chapterTitle: 'Struktur Projek iOS',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 6,
        chapterTitle: 'Networking dan Pengolahan Data',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 6,
        chapterTitle: 'User Interface Intermediate',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        courseId: 6,
        chapterTitle: 'Interaksi dengan Perangkat Keras',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
    ]

    const content = [
      {
        chapterId: 1,
        contentTitle: 'Tujuan Mengikuti Kelas Design System',
        duration: '1:00',
        status: true,
        contentUrl: 'https://youtu.be/ixOd42SEUF0',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 1,
        contentTitle: 'Pengenalan Design Sistem',
        duration: '1:00',
        status: true,
        contentUrl: 'https://youtu.be/DwTkyMJi890',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 2,
        contentTitle: 'Contoh Dalam Membangun Design System',
        duration: '1:00',
        status: false,
        contentUrl: 'https://youtu.be/rd-590n3H6w',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 2,
        contentTitle: 'Color Palette',
        duration: '1:00',
        status: false,
        contentUrl: 'https://youtu.be/HYfG_uCOlhc',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 3,
        contentTitle: 'Membuat Components',
        duration: '1:00',
        status: false,
        contentUrl: 'https://youtu.be/DmxXl1k0X5g',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 3,
        contentTitle: 'Membuat Design UI',
        duration: '1:00',
        status: false,
        contentUrl: 'https://youtu.be/yk_p1bi6Oyw',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 4,
        contentTitle: 'HTML dasar',
        duration: '1:00',
        status: true,
        contentUrl: 'https://youtu.be/1eJzLj9OE0Q',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 5,
        contentTitle: 'CSS dasar',
        duration: '1:00',
        status: true,
        contentUrl: 'https://youtu.be/6hIUgd6WuFw',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 6,
        contentTitle: 'Apa itu Class?',
        duration: '1:30',
        status: false,
        contentUrl: 'https://youtu.be/6hXoBeIQd-o',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 6,
        contentTitle: 'Kelebihan menggunakan Class',
        duration: '1:30',
        status: false,
        contentUrl: 'https://youtu.be/HVmmrTBdiFY',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 7,
        contentTitle: 'Apa itu module di Python?',
        duration: '1:30',
        status: true,
        contentUrl: 'https://youtu.be/eSrXU5vrgaI',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 7,
        contentTitle: 'Manfaat module di Python?',
        duration: '1:30',
        status: true,
        contentUrl: 'https://youtu.be/JVJc4k6xjTM',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
      {
        chapterId: 8,
        contentTitle: 'Apa itu Coroutine di Kotlin?',
        duration: '1:59',
        status: true,
        contentUrl: 'https://youtu.be/Sl0YBFJuvSU',
        updatedAt: '2023-11-28T06:25:24.446Z',
        createdAt: '2023-11-28T06:25:24.446Z',
      },
    ]

    await queryInterface.bulkInsert('Courses', courses)
    await queryInterface.bulkInsert('Chapters', chapter)
    await queryInterface.bulkInsert('Contents', content)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {})
    await queryInterface.bulkDelete('Chapters', null, {})
    await queryInterface.bulkDelete('Contents', null, {})
  },
}
