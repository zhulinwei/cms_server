
const createError = require('http-errors');

const Enum = require('../../common/enum');
const service = require('../../service');

const defaultIcon = 'fa-bars';

class MenuController {
  async save(ctx, next) {
    const { name, url, icon = defaultIcon, type = Enum.MenuType.ONE_LEVEL, hasChildren = false } = ctx.request.body;
    if (!url) throw new createError.BadRequest('无效的菜单地址');
    if (!name) throw new createError.BadRequest('无效的菜单名称');
    if (![ Enum.MenuType.ONE_LEVEL, Enum.MenuType.TWO_LEVEL ].includes(type)) 
      throw createError.BadRequest('无效的菜单类型');
    const exists = await service.setting.menu.exists({ name });
    if (exists) throw new createError.BadRequest('菜单已经存在，请勿重复添加');
    await service.setting.menu.save({ name, url, icon, type, hasChildren });
    ctx.status = 200;
  }

  async list(ctx, next) {
    const { selector = {}, options = {} } = ctx.request.body;
    ctx.body = await service.setting.menu.list(selector, options);
  } 

  async update(ctx, next) {
    const id = ctx.params.id;
    if (!id) throw new createError.BadRequest('无效的菜单编号');
    let updator = {};
    const { name, url, icon } = ctx.request.body;
    if (url) updator.url = url;
    if (name) updator.name = name;
    if (icon) updator.icon = icon;
    await service.setting.menu.update(id, updator);
    ctx.status = 200;
  }
  
  async remove(ctx, next) {
    const id = ctx.params.id;
    if (!id) throw new createError.BadRequest('无效的文章编号');
    await service.setting.menu.remove(id);
    ctx.status = 200;     
  }
}

module.exports = new MenuController();
