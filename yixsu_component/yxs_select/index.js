Component({
    properties: {
        multi:{
            type:Boolean,
            value:false
        },
        options:{
            type:Array,
            value:[]
        },
        select_options:{
            type:Array,
            value:[]
        },
        error_info: {
            type: String,
            value: ''
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        icon:{
            type: String,
            value:''
        },
        no_border: {
            type: Boolean,
            value: false
        },
        placeholder: {
            type: String,
            value: ''
        }
    },
    data:{
        show_list:false
    },

    methods: {
        open_close_options(){
            this.setData({
                show_list:!this.data.show_list
            })
        },
        select_one(event){
            var item = event.currentTarget.dataset.item;
            this.setData({
                select_options:[item]
            });
            this.open_close_options();
            this.triggerEvent('change', {select_options:this.data.select_options});
        },
        select(event){
            var index = event.currentTarget.dataset.index;
            this.data.options[index].selected = !this.data.options[index].selected;
            var select_options = [];
            this.data.options.forEach(function(e){
                if (e.selected) {
                    select_options.push(e);
                }

            }.bind(this))

            this.setData({
                options:this.data.options,
                select_options:select_options
            });
            this.triggerEvent('change', {select_options:this.data.select_options});
        }
    }
});
