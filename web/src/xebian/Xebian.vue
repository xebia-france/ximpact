<template>
  <section class="xebian">
    <el-card class="box-card">
      <h1>Xebian / {{xebian.firstname}} {{xebian.lastname}}</h1>
      <ul v-for="(impact, key) in xebian.impacts" :key="key">
        <span class="impact-desc">{{impact.description}}</span>
        <div class="badges">
          <span class="badge badge0">{{impact.customer.firstname}} {{impact.customer.lastname}}</span>
          <span class="badge badge1">{{impact.updated_at}}</span>
        </div>
        <li v-for="(feedback, key) in impact.feedbacks" :key="key">
          {{feedback.comment}}
          <div class="badges" v-if="feedback.comment">
            <span v-if="feedback.customer"
                  class="badge badge0">{{feedback.customer.firstname}} {{feedback.customer.lastname}}</span>
            <span v-if="feedback.xebian"
                  class="badge badge2">{{feedback.xebian.firstname}} {{feedback.xebian.lastname}}</span>
            <span class="badge badge1">{{feedback.updated_at}}</span>
          </div>
        </li>
        <el-form :model="feedback" ref="createFeedback">
          <el-form-item label="Commentaire(s)" prop="comment">
            <el-input type="textarea" :rows="2"
                      placeholder="Entrez un commentaire à propos des feedbacks précédents"
                      v-model="feedback.comment">
            </el-input>
          </el-form-item>
          <el-row type="flex" class="button" justify="end">
            <el-button type="primary" @click="createFeedback(impact.id)">OK</el-button>
          </el-row>
        </el-form>
      </ul>
    </el-card>
    <div class="xebian-edition">
      <xebian-update></xebian-update>
    </div>
  </section>
</template>

<script>
  import _ from 'lodash';
  import XebianService from './XebianService';
  import XebianUpdate from './update/XebianUpdate';
  import FeedbackService from '../feedback/FeedbackService';

  export default {
    data() {
      return {
        xebian: this.$store.state.xebian,
        feedback: {
          comment: '',
        },
        activeImpact: 0,
      };
    },
    components: {
      'xebian-update': XebianUpdate,
    },
    mounted() {
      XebianService.getXebian(this.$route.params.id, this.$store);
    },
    methods: {
      createFeedback(impactId) {
        FeedbackService.create('1', this.feedback.comment, impactId) // TODO change by current user id
          .then((feedback) => {
            const impact = _.find(this.xebian.impacts, i => i.id === impactId);
            if (impact) {
              impact.feedbacks.push(feedback);
            }
            this.$store.commit('setXebian', this.xebian);
            this.$forceUpdate();
            this.$message({
              message: 'Feedback créé ;) !',
              type: 'success',
            });
          })
          .catch(error => this.$message({
            message: `Une erreur s'est produite :( essayez à nouveau plus tard. ${error.message}`,
            type: 'error',
          }));
      },
    },
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .xebian {
    margin: 15px 10px;
    border-radius: 3px;
  }

  h1 {
    margin-bottom: 60px;
  }

  ul {
    list-style: none;
    padding-left: 0;

    .impact-desc {
      font-weight: 700;
    }

    .badge {
      display: inline-block;
      font-size: 10px;
      padding: 2px 5px;
      border-radius: 3px;

      &.badge0 {
        background: #819f99;
        color: #ffffff;
      }

      &.badge1 {
        background: #68768C;
        color: #ffffff;
        opacity: .6;
      }

      &.badge2 {
        background: #9894ad;
        color: #ffffff;
      }
    }

    .badges {
      margin-bottom: 20px;
    }

    li {
      font-weight: 400;
      margin-top: 10px;
    }
  }

  .xebian-edition {
    margin: 15px 0;
  }

  .item-title {

  }
</style>
