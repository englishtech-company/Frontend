<!-- <template>
  <div class="container">
    <div class="row">
      <div class="col-xl-3 col-md-3 col-6" v-for="({ icon, name }, ind) in blogCard" :key="ind">
        <div class="card blog-card">
          <div class="card-body text-center">
            <img :src="icon" alt="" />
            <h4>{{ name }}</h4>
          </div>
        </div>
      </div>

      <div class="col-xl-12">
        <div class="card">
          <div class="card-header border-0 m-0">
            <h4 class="heading mb-0 blog-title">Active users</h4>
          </div>
          <BlogActiveUsers />
        </div>
      </div>
      <BlogActiveUsers2 />
      <PopulerPost />
    </div>
  </div>
</template>

<script lang="ts">
import IMAGE from '@/constent/Theme'
import { defineComponent } from 'vue'
import BlogActiveUsers from '@/elements/blogContent/BlogActiveUsers.vue'
import BlogActiveUsers2 from '@/elements/blogContent/BlogActiveUsers2.vue'
import PopulerPost from '@/elements/blogContent/PopulerPost.vue'

export default defineComponent({
  name: 'blog_',
  components: { BlogActiveUsers, BlogActiveUsers2, PopulerPost },
  setup() {
    return {
      blogCard: [
        { icon: IMAGE.books, name: 'Education' },
        { icon: IMAGE.news, name: 'News' },
        { icon: IMAGE.heart, name: 'Ranking' },
        { icon: IMAGE.file, name: 'File Manager' }
      ]
    }
  }
})
</script>

<style scoped></style> -->
