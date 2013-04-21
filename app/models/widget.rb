class Widget < ActiveRecord::Base
  attr_accessible :css, :html, :js, :name, :options, :user_id
  validates :name, :presence => true

  belongs_to :user
end
