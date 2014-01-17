  {{#each businesses}}
      <a href="{{url}}" class="list-group-item">
        <h4 class="list-group-item-heading">{{name}}<img class="pull-right" src="{{rating_img_url}}"></h4>
        <p class="list-group-item-text">
        <img class="pull-right" width="75" height="75" src="{{image_url}}">
          <address>
          {{#each location.display_address}} 
          {{this}}<br>
          {{/each}}
          {{#if display_phone}}<abbr title="Phone">P:</abbr> {{display_phone}}{{/if}}
          </address>
      </p>
      </a>
  {{/each}}