<template>
  <div class="col-xl-8">
    <div class="accordion">
      <div class="accordion-item">
        <div
          class="accordion-header bg-white rounded-lg"
          id="headingOne"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-controls="collapseOne"
          aria-expanded="true"
          role="button"
        >
          <span class="accordion-header-icon"></span>
          <span class="accordion-header-text fw-semibold">Prompts</span>
          <span class="accordion-header-indicator"></span>
        </div>
        <div
          id="collapseOne"
          class="collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#accordion-one"
        >
          <div class="accordion-body-text">
            <div class="d-flex align-items-center mb-1">
              <h6 class="mb-0">article-title:</h6>
              <span class="badge badge-sm badge-danger light ms-1">description</span>
              <span class="mx-1">,</span>
              <span class="badge badge-sm badge-danger light">section-headlines</span>
            </div>
            <div class="mb-3">
              <textarea
                class="form-control bg-transparent"
                id="exampleFormControlTextarea1"
                rows="3"
                value="	Generate a title for an article that discusses the following topic:
	[[description]]
	The article will include the following sections:
	[[section-headlines]]

	Title:
  "
              />
            </div>
            <div class="d-flex align-items-center mb-1">
              <h6 class="mb-0">article-title:</h6>
              <span class="badge badge-sm badge-danger light ms-1">description</span>
              <span class="mx-1">,</span>
              <span class="badge badge-sm badge-danger light">section-headlines</span>
            </div>
            <div class="mb-3">
              <textarea
                class="form-control bg-transparent"
                id="exampleFormControlTextarea1"
                rows="3"
                value="	Generate a title for an article that discusses the following topic:
	[[description]]
	The article will include the following sections:
	[[section-headlines]]

	Title:
  "
              />
            </div>
            <div class="d-flex align-items-center mb-1">
              <h6 class="mb-0">article-title:</h6>
              <span class="badge badge-sm badge-danger light ms-1">description</span>
              <span class="mx-1">,</span>
              <span class="badge badge-sm badge-danger light">section-headlines</span>
            </div>
            <div class="mb-3">
              <textarea
                class="form-control bg-transparent"
                id="exampleFormControlTextarea1"
                rows="3"
                value="	Generate a title for an article that discusses the following topic:
	[[description]]
	The article will include the following sections:
	[[section-headlines]]

	Title:
  "
              />
            </div>
            <div class="d-flex align-items-center mb-1">
              <h6 class="mb-0">article-title:</h6>
              <span class="badge badge-sm badge-danger light ms-1">description</span>
              <span class="mx-1">,</span>
              <span class="badge badge-sm badge-danger light">section-headlines</span>
            </div>
            <div class="mb-3">
              <textarea
                class="form-control bg-transparent"
                id="exampleFormControlTextarea1"
                rows="3"
                value="	Generate a title for an article that discusses the following topic:
	[[description]]
	The article will include the following sections:
	[[section-headlines]]

	Title:
  "
              />
            </div>
            <div class="d-flex align-items-center mb-1">
              <h6 class="mb-0">article-title:</h6>
              <span class="badge badge-sm badge-danger light ms-1">description</span>
              <span class="mx-1">,</span>
              <span class="badge badge-sm badge-danger light">section-headlines</span>
            </div>
            <div class="mb-3">
              <textarea
                class="form-control bg-transparent"
                id="exampleFormControlTextarea1"
                rows="3"
                value="	Generate a title for an article that discusses the following topic:
	[[description]]
	The article will include the following sections:
	[[section-headlines]]

	Title:
  "
              />
            </div>
            <div class="d-flex align-items-center mb-1">
              <h6 class="mb-0">article-title:</h6>
              <span class="badge badge-sm badge-danger light ms-1">description</span>
              <span class="mx-1">,</span>
              <span class="badge badge-sm badge-danger light">section-headlines</span>
            </div>
            <div class="mb-3">
              <textarea
                class="form-control bg-transparent"
                id="exampleFormControlTextarea1"
                rows="3"
                value="	Generate a title for an article that discusses the following topic:
	[[description]]
	The article will include the following sections:
	[[section-headlines]]

	Title:
  "
              />
            </div>
            <div class="d-flex align-items-center mb-1">
              <h6 class="mb-0">article-title:</h6>
              <span class="badge badge-sm badge-danger light ms-1">description</span>
              <span class="mx-1">,</span>
              <span class="badge badge-sm badge-danger light">section-headlines</span>
            </div>
            <div class="mb-3">
              <textarea
                class="form-control bg-transparent"
                id="exampleFormControlTextarea1"
                rows="3"
                value="	Generate a title for an article that discusses the following topic:
	[[description]]
	The article will include the following sections:
	[[section-headlines]]

	Title:
  "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card h-auto" v-if="router.currentRoute.name == 'auto_write'">
      <div class="card-body p-0">
        <div class="table-responsive ai-table">
          <table class="table table-responsive-md">
            <thead>
              <tr>
                <th class="text-black">Type</th>
                <th class="text-black">Title</th>
                <th class="text-black">Date created</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Landing Page</td>
                <td class="text-primary">This is a test title generation</td>
                <td>July 10, 2023</td>
              </tr>
              <tr>
                <td>Landing Page</td>
                <td class="text-primary">This is a test title generation</td>
                <td>July 10, 2023</td>
              </tr>
              <tr>
                <td>Landing Page</td>
                <td class="text-primary">This is a test title generation</td>
                <td>July 10, 2023</td>
              </tr>

              <tr>
                <td>Landing Page</td>
                <td class="text-primary">This is a test title generation</td>
                <td>July 10, 2023</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'aiKit',
  data() {
    return { router }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped></style>
